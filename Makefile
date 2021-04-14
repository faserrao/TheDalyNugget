# This Makefile has serveral purposes:
# 2) It does a deployment to the target environment (AWS)
#    from the develooment machine - using the deploy: target.
# 3) It does a deployment to the target machine from the
#    CircleCi CI server.
#    CircleCi CI server.

.EXPORT_ALL_VARIABLES:

SLS_DEBUG								:- *

DN_PROJECT_STAGE						:= dev

DN_ROOT_PREFIX							:= the-daly-nugget
DN_ROOT_PREFIX_NO_DASHES				:= $(subst -,,$(DN_ROOT_PREFIX))
DN_SERVICE_PREFIX						:= $(DN_ROOT_PREFIX)-$(DN_PROJECT_STAGE)
DN_SERVICE_PREFIX_NO_DASHES_UPPER_T		:= $(subst th,Th,$(DN_ROOT_PREFIX_NO_DASHES))$(DN_PROJECT_STAGE)
DN_SERVICE_NAME							:= $(DN_ROOT_PREFIX)

DN_S3_BUCKET_PREFIX						:= $(DN_SERVICE_PREFIX)

DN_DOMAIN								:= $(DN_ROOT_PREFIX_NO_DASHES).com
DN_SUBDOMAIN							:= $(DN_PROJECT_STAGE).${DN_DOMAIN}

DN_REVS_EMAIL_ADDRESS					:= thenuggrev@thedalynugget.com
DN_NOD_EMAIL_ADDRESS					:= thenuggrev@gmail.com

DN_S3_STACK_OUTPUT_BUCKET				:= $(DN_S3_BUCKET_PREFIX)-stack-outputs
DN_S3_STACK_OUTPUT_FILE					:= stack-output

NUGGET_OF_THE_DAY_TABLE					:= nugget-of-the-day
NUGGET_BASE_TABLE						:= nugget-base
NUGGET_SUBSCRIBER_TABLE					:= nugget-subscriber
NUGGETEER_TABLE							:= nuggeteer
NUGGET_HISTORY_TABLE					:= nugget-history

DN_SES_CUSTOM_VERIFICATION_EMAIL_TEMPLATE_NAME		:= $(DN_SERVICE_PREFIX)-verification-email-template
DN_SES_EMAIL_RECEIPT_RULE_SET_NAME					:= $(DN_ROOT_PREFIX)-email-received-rule-set

DN_SERVERLESS_OUTPUT_LOG_FILE	:= $(DN_SERVICE_PREFIX)-serverless-output

DN_HOME_DIR						:= $(DN_PROJECTS_DIR)/$(DN_ROOT_PREFIX)

DN_APIG_SDK_DIR_NAME			:= apiGateway-js-sdk
DN_APIG_LOCAL_DIR_NAME			:= gateway
DN_APIG_SDK_OUTPUT_FILE			:= $(DN_APIG_LOCAL_DIR_NAME).zip

DN_CLIENT_DIR					:= $(DN_PROJECTS_DIR)/client/public/es6
DN_ASSETS_DIR					:= $(DN_CLIENT_DIR)/assets

DN_UTILS_DIR					:= ${DN_HOME_DIR}/utilities
DN_SERVICE_DIR					:= $(DN_HOME_DIR)/server/node
DN_IMPORT_NUGGETS_DIR			:= $(DN_UTILS_DIR)/nugget-import
DN_SEED_NUGGET_BASE_SCRIPT		:= put_requests.js
DN_NUGGET_OF_THE_DAY_FILE		:= nod-table-item.json

# The following is used by the Javascript program that prepopulates the
# nugget base table with quotes.  I add the extension here, because in all
# other uses the tables names suffexed witht the stage in serverless.yml.

NUGGET_BASE_TABLE_STAGE			:= $(NUGGET_BASE_TABLE)-$(DN_PROJECT_STAGE)

# Some commands run on CircleCi require superuser permissions.  This variable
# should be set to mull on make command line when running locally on the
# development machine.  I use the USER environment variable to determine whether
# it is a local run or not.

nullstring :=
SUDO := sudo
ifeq ($(USER),fas)
SUDO := $(nullstring)
endif

clean_dirs:
	rm -rf ./node_modules
	rm -f ./package-lock.json

install_packages:
	$(SUDO) npm install serverless@1.62.0 -g
	npm install

clean_local: clean_dirs install_packages

clean_aws:
	$(SUDO) $(SW_INSTALL_PATH)aws s3api list-buckets --query 'Buckets[?starts_with(Name, `$(DN_S3_BUCKET_PREFIX)`) == `true`].[Name]' --output text | xargs -I {} $(SUDO) $(SW_INSTALL_PATH)aws s3 rb s3://{} --force
	$(SUDO) $(SW_INSTALL_PATH)aws cloudformation delete-stack --stack-name $(DN_SERVICE_PREFIX)

nuke_cloud_watch:
	$(DN_UTILS_DIR)/nuke-cloud-watch.bsh

clean_all: clean_local clean_aws nuke_cloud_watch

deploy_serverless: IS_LOCAL := false
deploy_serverless:
	@printf "Running serverless deploy.\n"
	cd $(DN_SERVICE_DIR) && serverless deploy -v > $(DN_SERVERLESS_OUTPUT_LOG_FILE)

seed_dynamo:
	@printf "Seeding the nugget of the day table.\n"
	cd $(DN_IMPORT_NUGGETS_DIR) && $(SUDO) $(SW_INSTALL_PATH)aws dynamodb put-item --table-name $(NUGGET_OF_THE_DAY_TABLE)-$(DN_PROJECT_STAGE)  --item file://$(DN_NUGGET_OF_THE_DAY_FILE)

get_client_sdk:
	cd $(DN_ASSETS_DIR) && rm -rf $(DN_APIG_LOCAL_DIR_NAME)
	cd $(DN_ASSETS_DIR) && aws apigateway get-sdk --rest-api-id `aws apigateway get-rest-apis --output text --query 'items[*].[id]'` --stage-name $(DN_PROJECT_STAGE) --sdk-type javascript $(DN_APIG_SDK_OUTPUT_FILE)
	cd $(DN_ASSETS_DIR) && unzip $(DN_APIG_SDK_OUTPUT_FILE) && rm $(DN_APIG_SDK_OUTPUT_FILE) && mv $(DN_APIG_SDK_DIR_NAME) $(DN_APIG_LOCAL_DIR_NAME)

copy_static_files_to_bucket:
	aws s3 cp --recursive $(DN_CLIENT_DIR)/ s3://$(shell aws cloudfront list-distributions --output text --query 'DistributionList.Items[*].Origins.Items[*].Id')

deploy_client: get_client_sdk copy_static_files_to_bucket

deploy:	IS_LOCAL := false
deploy: clean_local deploy_serverless 
