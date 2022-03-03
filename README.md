# Okta Cross Channel Auth

This repository shows a reference implementation for performing authentication of a user in a cross channel scenario. A user interacting with a customer care agent on an instant messaging channel is asked to authenticate to the web service. As a result of authenticate is presented a nine digit verification code to be given to the care agent on whichever channel they are using. The care agent can then use this code to retrieve a proof of authentication for that user based on the JWT minted for the user.


:warning: Disclaimer: This project serves as a reference implementation, that
you can tweak or completely repurpose. It is community-supported and is not an
official Okta product and does not qualify for any Okta support. We makes no
warranties regarding this project. Anyone who chooses to use this project must
ensure that their implementation meets any applicable legal obligations
including any Okta terms and conditions.


## Setup

This application exists as a single node OIDC client. Follow the steps [here](https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard_OIDC.htm) to create a new OIDC application in Okta. You will require a callback uri of ```http://<your baseuri>/authorization-code/callback```.


### Running Locally
This is a lightweight express application once you have node installed on your
machine:
* clone this repo
* run ```npm install```
* create a ```.env``` file with the content shown in [Configuration](#Configuration)
    * follow [this
      guide](https://developer.okta.com/docs/guides/sign-into-web-app/nodeexpress/create-okta-application/)
      to get your application setup on Okta
* run ```npm run start```

#### Launch on Heroku