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
#
# Please note that some of the variables defined in this
# Makefile are overriden on the make command line.  The
# varibled affected depend on the target deployment
# environment.  Comments have been included in this Makefile
# which specify which variables are deplpyment specific.
# Force redeploy***

.EXPORT_ALL_VARIABLES:

# DN_PROJECT_DIR as defined in the bash shell supports both the
# local: and deploy: targets when the make is run on the
# development machine.  This # variable is overriden on the make
# command line (in the config.yml file when deploying # from CircleCi.

#DN_PROJECT_STAGE											:= dev
#DN_PROJECT_STAGE											:= test
#DN_PROJECT_STAGE											:= prod
DN_PROJECT_STAGE											:= staging

DN_ROOT_PREFIX												:= the-daly-nugget
DN_ROOT_PREFIX_NO_DASHES						:= thedalynugget
DN_SERVICE_PREFIX_DASHES							:= $(DN_ROOT_PREFIX)-$(DN_PROJECT_STAGE)
DN_SERVICE_PREFIX_NO_DASHES						:= $(DN_ROOT_PREFIX_NO_DASHES)$(DN_PROJECT_STAGE)
DN_SERVICE_PREFIX_NO_DASHES_UPPER_T		:= Thedalynugget$(DN_PROJECT_STAGE)

DN_SERVICE_NAME												:= $(DN_ROOT_PREFIX)-service

DN_SES_DNS_TXT_REC_NAME		:= _amazonses.${DN_ROOT_PREFIX_NO_DASHES}.com
# DN_SES_DNS_TXT_REC_NAME		:= _amazonses.thedalynugget.com

DN_DOMAIN															:= thedalynugget.com
DN_SUBDOMAIN													:= $(DN_PROJECT_STAGE).${DN_DOMAIN}

DN_REVS_EMAIL_ADDRESS									:= thenuggrev@gmail.com

# The following variables refer to resources on AWS.
#
#AWS_PROFILE													:= serverless-admin
AWS_REGION														:= us-east-1
#DN_AWS_PROFILE												:= ${AWS_PROFILE}
DN_AWS_REGION													:= ${AWS_REGION}

DN_S3_BUCKET_PREFIX										:= $(DN_SERVICE_PREFIX_DASHES)
DN_S3_STACK_OUTPUT_BUCKET							:= $(DN_S3_BUCKET_PREFIX)-stack-outputs
DN_S3_STACK_OUTPUT_FILE								:= stack-output

NUGGET_OF_THE_DAY_TABLE								:= nugget-of-the-day
NUGGET_BASE_TABLE											:= nugget-base
NUGGET_SUBSCRIBER_TABLE								:= nugget-subscriber
NUGGETEER_TABLE												:= nuggeteer
NUGGET_HISTORY_TABLE									:= nugget-history

DN_SES_CUSTOM_VERIFICATION_EMAIL_TEMPLATE_FILE				:= $(DN_SERVICE_PREFIX_DASHES)-verification-email-template-file.json
DN_SES_CUSTOM_VERIFICATION_EMAIL_TEMPLATE_NAME				:= $(DN_SERVICE_PREFIX_DASHES)-verification-template
DN_SES_EMAIL_RECEIPT_RULE_SET_NAME										:= $(DN_ROOT_PREFIX)-email-received-rule-set

# All the following variables refer to objects on the development or build machine.
#
DN_LOCAL_REGION							:= localhost
DN_LOCAL_HOST_NAME					:= localhost
DN_LOCAL_DYNAMO_PORT				:= 8000
DN_LOCAL_DDB_ENDPOINT				:= http://$(DN_LOCAL_HOST_NAME):${DN_LOCAL_DYNAMO_PORT}

DN_SERVERLESS_OUTPUT_LOG_FILE					:= $(DN_SERVICE_PREFIX_DASHES)-serverless-output
DN_SERVERLESS_OUTPUT_FILE							:= $(DN_SERVICE_PREFIX_DASHES)-stack-output.toml

DN_HOME_DIR									:= $(DN_PROJECTS_DIR)/TheDalyNugget
DN_ASSETS_DIR								:= $(DN_HOME_DIR)/client/public/es6/assets
DN_APIG_SDK_DIR_NAME				:= apiGateway-js-sdk
DN_APIG_CLIENT_FILE					:= apigClient.js
DN_APIG_LOCAL_DIR_NAME			:= gateway
DN_APIG_DIR									:= $(DN_ASSETS_DIR)/$(DN_APIG_LOCAL_DIR_NAME)
DN_APIG_SDK_OUTPUT_FILE			:= $(DN_ASSETS_DIR)/$(DN_APIG_LOCAL_DIR_NAME).zip
DN_ORIGINAL_APIG_FILE				:= original_apig.js
DN_SERVICE_DIR							:= $(DN_HOME_DIR)/server/node/$(DN_SERVICE_NAME)
DN_SCRIPTS_DIR							:= $(DN_SERVICE_DIR)/scripts
DN_IMPORT_NUGGETS_DIR				:= $(DN_SCRIPTS_DIR)/NuggetImport
DN_SEED_NUGGET_BASE_SCRIPT	:= put_requests.js
DN_NUGGET_OF_THE_DAY_FILE		:= nod-table-item.json
DN_SES_DNS_TXT_REC_VAL_FILE		:= $(DN_SCRIPTS_DIR)/dns-ses-text-rec-val.txt
DN_SERVERLESS_VAR_JS_FILE		:= $(DN_SCRIPTS_DIR)/serverlessVariables.js

# The following is used by the Javascript program that prepopulates the
# nugget base table with quotes.  I add the extension here, because in all
# other uses the tables names suffexed witht the stage in serverless.yml.

NUGGET_BASE_TABLE_STAGE			:= $(NUGGET_BASE_TABLE)-$(DN_PROJECT_STAGE)

# Need to create symbolic link from $(DN_SERVICE_DIR)/client/dist 
# to $(DN_HOME_DIR)/client/public/es6.  This is used by
# Serverless Finch.

DN_CLIENT_ES6_DIR								:= $(DN_HOME_DIR)/client/public/es6
DN_DIST_DIR_S_LINK							:= $(DN_SERVICE_DIR)/client/dist 

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

nothing:
	echo $(SUDO)

# The set_apigateway_online target ensures the local api gateway sdk points
# to the aws online api gateway endpoint.  This is useful if one wants to use
# the local web pages, but point to the aws api gateway.

set_apigateway_online:	IS_LOCAL := false
set_apigateway_online:
	cp $(DN_APIG_DIR)/$(DN_ORIGINAL_APIG_FILE) $(DN_APIG_DIR)/$(DN_APIG_CLIENT_FILE)

default: deploy

clean:
	rm -rf ./node_modules
	rm -f ./package-lock.json
	rm -f $(DN_DIST_DIR_S_LINK)
	cd $(DN_SERVICE_DIR) && rm -f node_modules
	cd $(DN_SERVICE_DIR) && rm -f package.json
	$(SUDO) npm install serverless@1.62.0 -g
	npm install
	cd $(DN_HOME_DIR) && mv node_modules/@anttiviljami/serverless-stack-output ./node_modules 
	cd $(DN_SERVICE_DIR) && ln -s -f ../../../package.json package.json
	cd $(DN_SERVICE_DIR) && ln -s -f ../../../node_modules node_modules

clean_aws:
	$(SUDO) $(SW_INSTALL_PATH)aws s3api list-buckets --query 'Buckets[?starts_with(Name, `$(DN_S3_BUCKET_PREFIX)`) == `true`].[Name]' --output text | xargs -I {} $(SUDO) $(SW_INSTALL_PATH)aws s3 rb s3://{} --force
	
# The rule set is the same for all versions (prod, dev. etc.) so don't delete unless we want to do a complete cleanup.
# A complete cleanup target has not been implemented yet.
	node $(DN_SCRIPTS_DIR)/ses_deletereceiptruleset.js 
#
#	@printf "Deleting the SES custom verfication email template.\n"
	$(SUDO) $(SW_INSTALL_PATH)aws ses delete-custom-verification-email-template --template-name $(DN_SES_CUSTOM_VERIFICATION_EMAIL_TEMPLATE_NAME)

#	@printf "Deleting all the SES email and domain dentities.\n"
	$(SUDO) $(SW_INSTALL_PATH)aws ses list-identities --output text | cut -f 2 | xargs -I {} $(SUDO) $(SW_INSTALL_PATH)aws ses delete-identity --identity {}
#
#	@printf "Deleting just the SES email identities.\n"
	$(SUDO) $(SW_INSTALL_PATH)aws ses list-identities --identity-type EmailAddress --output text | cut -f 2 | xargs -I {} $(SUDO) $(SW_INSTALL_PATH)aws ses delete-identity --identity {}
#
#	@printf "Deleting just the SES domain identities.\n"
	$(SUDO) $(SW_INSTALL_PATH)aws ses list-identities --identity-type Domain --output text | cut -f 2 | xargs -I {} $(SUDO) $(SW_INSTALL_PATH)aws ses delete-identity --identity {}
	
	$(SUDO) $(SW_INSTALL_PATH)aws cloudformation delete-stack --stack-name $(DN_SERVICE_NAME)-$(DN_PROJECT_STAGE)

print_serverless: IS_LOCAL := false
print_serverless:
	@printf "Running serverless print.\n"
	cd $(DN_SERVICE_DIR) && serverless print

deploy_ses_identities:
	@printf "Creating the the SES TheDalyNugget.com domain.\n"
	$(SUDO) $(SW_INSTALL_PATH)aws ses verify-domain-identity --output=text --domain $(DN_DOMAIN) > $(DN_SCRIPTS_DIR)/dns-ses-text-rec-val.txt

	@printf "Creating the the SES thenuggrev@gmail.com email identity.\n"
	$(SUDO) $(SW_INSTALL_PATH)aws ses verify-email-identity --email-address $(DN_REVS_EMAIL_ADDRESS)

# TODO: Bucket name and key need to be variables. Maybe here as well as serverless.yml.

deploy_serverless: IS_LOCAL := false
deploy_serverless: DN_SES_DNS_TXT_REC_VAL := $(shell cat $(DN_SES_DNS_TXT_REC_VAL_FILE))
deploy_serverless:
	@printf "Exported DN_SES_DNS_TXT_REC_VAL = " $(DN_SES_DNS_TXT_REC_VAL)
	@printf "Running serverless deploy.\n"
	cd $(DN_SERVICE_DIR) && serverless deploy -v > $(DN_SCRIPTS_DIR)/$(DN_SERVERLESS_OUTPUT_LOG_FILE)
#	cd $(DN_SERVICE_DIR) && serverless deploy -v
	$(SUDO) $(SW_INSTALL_PATH)aws s3 cp $(DN_SCRIPTS_DIR)/$(DN_SERVERLESS_OUTPUT_FILE) s3://$(DN_S3_STACK_OUTPUT_BUCKET)/$(DN_S3_STACK_OUTPUT_FILE)

deploy_dynamo:
#	@# Populate dyanamodb nugget-base table
#	@printf "Seeding the nugget-base table.\n"
#	node $(DN_IMPORT_NUGGETS_DIR)/$(DN_SEED_NUGGET_BASE_SCRIPT)
	@# Populate dyanamodb nugget-of-the-day table
	@# Table names should be environment variables used here and in Serverless.yml
	@# NUGGET_OF_THE_DAY_TABLE
	@printf "Seeding the nugget of the day table.\n"
	cd $(DN_IMPORT_NUGGETS_DIR) && $(SUDO) $(SW_INSTALL_PATH)aws dynamodb put-item --table-name $(NUGGET_OF_THE_DAY_TABLE)-$(DN_PROJECT_STAGE)  --item file://$(DN_NUGGET_OF_THE_DAY_FILE)

deploy_ses_rules:
	@printf "Deleting the SES custom verfication email template.\n"
	$(SUDO) $(SW_INSTALL_PATH)aws ses delete-custom-verification-email-template --template-name $(DN_SES_CUSTOM_VERIFICATION_EMAIL_TEMPLATE_NAME)
	@printf "Creating the the SES custom verification email template.\n"
	cd $(DN_SCRIPTS_DIR) && $(SUDO) $(SW_INSTALL_PATH)aws ses create-custom-verification-email-template --cli-input-json file://$(DN_SES_CUSTOM_VERIFICATION_EMAIL_TEMPLATE_FILE)
	@printf "Cloudformation does not support activating the receipt rule set so need to do it here.\n"
	$(SUDO) $(SW_INSTALL_PATH)aws ses set-active-receipt-rule-set --rule-set-name $(DN_SES_EMAIL_RECEIPT_RULE_SET_NAME)

deploy_apigateway:
	@printf "Setting up the Api Gateway SDK.\n"
	$(DN_SCRIPTS_DIR)/setup-apig-sdk.bsh

deploy_client: DN_SES_DNS_TXT_REC_VAL := $(shell cat $(DN_SES_DNS_TXT_REC_VAL_FILE))
deploy_client:
	@# The following uses the Finch plugin to deploy the static client files
	@# to the S3 bucket.  It is directed by the client subsection of the 
	@# custom section in serverless.yml
	@printf "Deploying the serverless client.\n"
	@# Create a symbolic link so the files look like they are where Finch
	@# expects them to b.
	cd $(DN_SERVICE_DIR) && mkdir -p client
	ln -s $(DN_CLIENT_ES6_DIR) $(DN_DIST_DIR_S_LINK)
	cd $(DN_SERVICE_DIR) && echo Y | serverless client deploy

deploy_function:
	serverless deploy function -f getRandomNugget

port_to_sam:
	cd $(DN_SERVICE_DIR) && serverless sam export --output ./sam-template.yml

deploy:	IS_LOCAL := false
#deploy: clean deploy_ses_identities deploy_serverless deploy_dynamo deploy_apigateway deploy_client deploy_ses_rules
deploy: clean deploy_ses_identities deploy_serverless deploy_dynamo deploy_apigateway deploy_client deploy_ses_rules
#deploy: clean deploy_ses_identities deploy_serverless deploy_dynamo deploy_ses_rules deploy_apigateway
#deploy: clean deploy_ses_identities deploy_serverless deploy_dynamo deploy_ses_rules
#deploy: clean deploy_ses_identities deploy_serverless deploy_dynamo
#deploy: clean deploy_ses_identities deploy_serverless
#deploy: deploy_ses_identities deploy_serverless
#deploy: clean deploy_serverless deploy_apigateway deploy_client

local:	IS_LOCAL := true
local:	DYNAMO_ENDPOINT := http://localhost:8000
local:	local_apigateway local_serverless local_ses local_dynamo
#local:	local_apigateway local_serverless local_ses
#local:	local_apigateway local_serverless local_ses local_dynamo start_dynamo_admin
#local:	clean local_apigateway local_serverless local_ses local_dynamo start_dynamo_admin
#local:	clean local_apigateway local_serverless local_ses local_dynamo
#local:	local_apigateway local_serverless local_ses local_dynamo
#local:	clean local_apigateway local_serverless local_ses
