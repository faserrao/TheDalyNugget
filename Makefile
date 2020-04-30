# This Makefile has serveral purposes:
# 1) It does a Serverless "offline" build on the development
#    machine.  This is accomplished via the local: target.
# 2) It does a deployment to the target environment (AWS)
#    from the develooment machine - using the deploy: target.
# 3) It does a deployment to the target machine from the
#    CircleCi CI server.
# 4) It also has the potentail to deploy "locally" on  the
#    CircleCi CI server for unit testing purposes (possibly
#    integration testing as well.

.EXPORT_ALL_VARIABLES:

SLS_DEBUG										:- *

DN_PROJECT_STAGE						:= dev

DN_ROOT_PREFIX							:= the-daly-nugget
DN_ROOT_PREFIX_PASCAL_CASE				:= TheDalyNugget
DN_ROOT_PREFIX_NO_DASHES				:= $(subst -,,$(DN_ROOT_PREFIX))
DN_SERVICE_PREFIX_DASHES				:= $(DN_ROOT_PREFIX)-$(DN_PROJECT_STAGE)
DN_SERVICE_PREFIX_NO_DASHES				:= $(DN_ROOT_PREFIX_NO_DASHES)$(DN_PROJECT_STAGE)
DN_SERVICE_PREFIX_NO_DASHES_UPPER_T		:= $(subst th,Th,$(DN_ROOT_PREFIX_NO_DASHES))$(DN_PROJECT_STAGE)
DN_S3_BUCKET_PREFIX						:= $(DN_SERVICE_PREFIX_DASHES)

DN_SERVICE_NAME							:= $(DN_ROOT_PREFIX)-service

DN_DOMAIN								:= $(DN_ROOT_PREFIX_NO_DASHES).com
DN_SUBDOMAIN							:= $(DN_PROJECT_STAGE).${DN_DOMAIN}

DN_REVS_EMAIL_ADDRESS					:= thenuggrev@thedailynugget.com

DN_S3_STACK_OUTPUT_BUCKET				:= $(DN_S3_BUCKET_PREFIX)-stack-outputs
DN_S3_STACK_OUTPUT_FILE					:= stack-output

NUGGET_OF_THE_DAY_TABLE					:= nugget-of-the-day
NUGGET_BASE_TABLE						:= nugget-base
NUGGET_SUBSCRIBER_TABLE					:= nugget-subscriber
NUGGETEER_TABLE							:= nuggeteer
NUGGET_HISTORY_TABLE					:= nugget-history

DN_SES_CUSTOM_VERIFICATION_EMAIL_TEMPLATE_FILE		:= $(DN_SERVICE_PREFIX_DASHES)-verification-email-template-file.json
DN_SES_CUSTOM_VERIFICATION_EMAIL_TEMPLATE_NAME		:= $(DN_SERVICE_PREFIX_DASHES)-verification-template
DN_SES_EMAIL_RECEIPT_RULE_SET_NAME					:= $(DN_ROOT_PREFIX)-email-received-rule-set

# All the following variables refer to objects on the development or build machine.
#
DN_LOCAL_REGION			:= localhost
DN_LOCAL_HOST_NAME		:= localhost
DN_LOCAL_DYNAMO_PORT	:= 8000
DN_LOCAL_DDB_ENDPOINT	:= http://$(DN_LOCAL_HOST_NAME):${DN_LOCAL_DYNAMO_PORT}

DN_SERVERLESS_OUTPUT_LOG_FILE	:= $(DN_SERVICE_PREFIX_DASHES)-serverless-output

DN_HOME_DIR						:= $(DN_PROJECTS_DIR)/$(DN_ROOT_PREFIX_PASCAL_CASE)
DN_ASSETS_DIR					:= $(DN_HOME_DIR)/client/public/es6/assets
DN_APIG_SDK_DIR_NAME			:= apiGateway-js-sdk
DN_APIG_CLIENT_FILE				:= apigClient.js
DN_APIG_LOCAL_DIR_NAME			:= gateway
DN_APIG_DIR						:= $(DN_ASSETS_DIR)/$(DN_APIG_LOCAL_DIR_NAME)
DN_APIG_SDK_OUTPUT_FILE			:= $(DN_ASSETS_DIR)/$(DN_APIG_LOCAL_DIR_NAME).zip
DN_ORIGINAL_APIG_FILE			:= original_apig.js
DN_SERVICE_DIR					:= $(DN_HOME_DIR)/server/node/$(DN_SERVICE_NAME)
DN_SCRIPTS_DIR					:= $(DN_SERVICE_DIR)/scripts
DN_IMPORT_NUGGETS_DIR			:= $(DN_SCRIPTS_DIR)/NuggetImport
DN_SEED_NUGGET_BASE_SCRIPT		:= put_requests.js
DN_NUGGET_OF_THE_DAY_FILE		:= nod-table-item.json

# The following is used by the Javascript program that prepopulates the
# nugget base table with quotes.  I add the extension here, because in all
# other uses the tables names suffexed witht the stage in serverless.yml.

NUGGET_BASE_TABLE_STAGE			:= $(NUGGET_BASE_TABLE)-$(DN_PROJECT_STAGE)

# Need to create symbolic link from $(DN_SERVICE_DIR)/client/dist 
# to $(DN_HOME_DIR)/client/public/es6.  This is used by
# Serverless Finch.

DN_CLIENT_ES6_DIR				:= $(DN_HOME_DIR)/client/public/es6
DN_DIST_DIR_S_LINK				:= $(DN_SERVICE_DIR)/client/dist 

DN_SES_LOCAL_CUSTOM_VERIFICATION_EMAIL_TEMPLATE_FILE	:= $(DN_ROOT_PREFIX)-local-verification-email-template-file.json

# Some commands run on CircleCi require superuser permissions.  This variable
# should be set to mull on make command line when running locally on the
# development machine.  I use the USER environment variable to determine whether
# it is a local run or not.

nullstring :=
SUDO := sudo
ifeq ($(USER),fas)
SUDO := $(nullstring)
else ifdef CODEBUILD_BUILD_ARN
SUDO := $(nullstring)
endif

# The set_apigateway_online target ensures the local api gateway sdk points
# to the aws online api gateway endpoint.  This is useful if one wants to use
# the local web pages, but point to the aws api gateway.

set_apigateway_online:	IS_LOCAL := false
set_apigateway_online:
	cp $(DN_APIG_DIR)/$(DN_ORIGINAL_APIG_FILE) $(DN_APIG_DIR)/$(DN_APIG_CLIENT_FILE)

clean_local:
	rm -rf ./node_modules
	rm -f ./package-lock.json
	rm -f $(DN_DIST_DIR_S_LINK)
	cd $(DN_SERVICE_DIR) && rm -f node_modules
	cd $(DN_SERVICE_DIR) && rm -f package.json
	$(SUDO) npm install serverless@1.62.0 -g
	npm install
#	cd $(DN_HOME_DIR) && mv node_modules/@anttiviljami/serverless-stack-output ./node_modules 
	cd $(DN_SERVICE_DIR) && ln -s -f ../../../package.json package.json
	cd $(DN_SERVICE_DIR) && ln -s -f ../../../node_modules node_modules

clean_aws:
	$(SUDO) $(SW_INSTALL_PATH)aws s3api list-buckets --query 'Buckets[?starts_with(Name, `$(DN_S3_BUCKET_PREFIX)`) == `true`].[Name]' --output text | xargs -I {} $(SUDO) $(SW_INSTALL_PATH)aws s3 rb s3://{} --force
	$(SUDO) $(SW_INSTALL_PATH)aws s3api list-buckets --query 'Buckets[?starts_with(Name, `$(DN_SERVICE_NAME)`) == `true`].[Name]' --output text | xargs -I {} $(SUDO) $(SW_INSTALL_PATH)aws s3 rb s3://{} --force
	$(SUDO) $(SW_INSTALL_PATH)aws cloudformation delete-stack --stack-name $(DN_SERVICE_NAME)-$(DN_PROJECT_STAGE)

clean_all: clean_local clean_aws

deploy_serverless: IS_LOCAL := false
deploy_serverless:
	@printf "Running serverless deploy.\n"
	cd $(DN_SERVICE_DIR) && serverless deploy -v > $(DN_SCRIPTS_DIR)/$(DN_SERVERLESS_OUTPUT_LOG_FILE)

get_client_sdk:
	rm -rf $(DN_APIG_DIR)
	aws apigateway get-sdk --rest-api-id `aws apigateway get-rest-apis --output text --query 'items[*].[id]'` --stage-name $(DN_PROJECT_STAGE) --sdk-type javascript $(DN_ASSETS_DIR)/$(DN_APIG_SDK_OUTPUT_FILE)
	cd $(DN_ASSETS_DIR) && unzip $(DN_APIG_SDK_OUTPUT_FILE) && rm $(DN_APIG_SDK_OUTPUT_FILE) && mv $(DN_APIG_SDK_DIR_NAME) $(DN_APIG_LOCAL_DIR_NAME)

deploy_static:
	# The following uses the Finch plugin to deploy the static client files to the S3 bucket.
	# Create a symbolic link so the files look like they are where Finch expects them to b.
	cd $(DN_SERVICE_DIR) && mkdir -p client
	ln -s $(DN_CLIENT_ES6_DIR) $(DN_DIST_DIR_S_LINK)
	cd $(DN_SERVICE_DIR) && echo Y | serverless client deploy

seed_dynamo:
	@printf "Seeding the nugget of the day table.\n"
	cd $(DN_IMPORT_NUGGETS_DIR) && $(SUDO) $(SW_INSTALL_PATH)aws dynamodb put-item --table-name $(NUGGET_OF_THE_DAY_TABLE)-$(DN_PROJECT_STAGE)  --item file://$(DN_NUGGET_OF_THE_DAY_FILE)

deploy:	IS_LOCAL := false
#deploy: clean seed_dynamo deploy_apigateway deploy_static deploy_ses_rules
deploy: clean_local deploy_serverless 
#deploy: clean_local deploy_serverless seed_dynamo deploy_apigateway deploy_static deploy_ses_rules
#deploy: clean deploy_serverless seed_dynamo deploy_ses_rules deploy_apigateway
#deploy: clean deploy_serverless seed_dynamo deploy_ses_rules
#deploy: clean  deploy_serverless seed_dynamo
#deploy: clean deploy_serverless
#deploy: deploy_serverless
#deploy: clean deploy_serverless deploy_apigateway deploy_static
