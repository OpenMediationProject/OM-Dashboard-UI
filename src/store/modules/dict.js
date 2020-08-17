import { getMessageDict } from '@/api/login'

const msg = {
  pubapp: {
    id_empty: 'Please enter App Store or Google Play URL',
    id_pattern: 'App id is incorrect',
    name_empty: 'Please enter app name.',
    app_not_found: 'App is not found in store',
    coppa_not_allowed: 'Must be checked.',
    app_key_copied: 'Copied App Key value to the clipboard',
    ads_code_copied: 'Copied Code Snippet to the clipboard',
    status_update: 'Update successfully.',
    verify_success: 'Verify successfully',
    alert_title: 'Congrats! Your App is created successfully.',
    alert_content: 'Next steps：Manage placement to display ads in your app.',
    alert_button: 'Manage Placement'

  },
  placement: {
    update_success: 'Update successfully.',
    create_success: 'Create successfully.',
    scene_status: 'Update successfully.',
    name_empty: 'Please enter placement name.',
    alert_instance_title: 'You already have Rewarded Video and Interstitial placement.',
    alert_instance_content: 'Next steps：Create a new placement or Setup instances to Monitize',
    alert_instance_button: 'Setup Instance',
    alert_instance_new_title: 'Your Placement is created successfully.',
    alert_instance_new_content: 'Next steps：Setup an Instance to Monitize',
    alert_instance_new_button: 'Setup Instance',
    alert_waterfall_title: 'Everything is ready.',
    alert_waterfall_content: 'Next steps：Setup a Mediation Rule to Monitize',
    alert_waterfall_button: 'Setup Mediation Rule'

  },
  instance: {
    update_success: 'Update instance successfully.',
    create_success: 'Create instance successfully.',
    adn_empty: 'Please select an AdNetwork.',
    name_empty: 'Please enter Instance name.',
    unit_id_empty: 'Please enter Unit ID.',
    placement_key_exits: 'This Placement ID already exits.'

  },
  scenes: {
    name_empty: 'Please enter Scene name.',
    update_success: 'Update scene successfully',
    create_success: 'Create scene successfully'
  },
  mediation: {
    name_empty: 'Please enter Mediation Rule Name.',
    regions_empty: 'Regions can not be empty.',
    optimized_type_empty: 'Please select Optimized Type.',
    channel_too_long: 'Data too long for Channel, Please control at 1000 characters',
    update_success: 'Update Mediation Rule successfully',
    create_success: 'Create Mediation Rule successfully',
    remove_confirm: 'Are you really sure?',
    rule_instance_update: 'Update instance successfully'
  },
  sdk: {
    set_all: 'Please set all results',
    select_one: 'Please select one Ad NetWork',
    device_name_empty: 'Please enter device name',
    id_empty: 'Please enter ID'
  },
  abt: {
    name_empty: 'Please enter name',
    name_pattern: 'Characters longer than 40',
    placement_empty: 'Please select Placement',
    setup_all_segments: 'Please setup group B segments.',
    setup_app_unitid: 'Plase setup all Unit ID.',
    rule_empty: 'Mediation Rule in group A is empty!'
  },
  appsettings: {
    update_success: 'Update successfully',
    create_success: 'Create successfully',
    copied_success: 'Copied to the clipboard',
    app_key: 'App Key can not be empty.',
    api_token: 'API Token can not be empty.',
    app_id: 'App ID can not be empty',
    system_user_access_token: 'System User Access Token can not be empty',
    game_id: 'Game ID can not be empty.',
    sdk_key: 'SDK Key can not be empty.',
    app_signature: 'App Signature can not be empty',
    adn_account: 'Please select Ad Network Account.',
    plat_check: 'Platform mismatch'
  },
  account: {
    update_success: 'Update successfully',
    create_success: 'Create successfully',
    remove_success: 'Remove successfully',
    account_name: 'Account Name can not be empty.',
    currency: 'Please select Currency.',
    adn_empty: 'Ad Network can not be empty.',
    app_key: 'App Key can not be empty.',
    api_token: 'API Token can not be empty.',
    client_id: 'Client ID can not be empty.',
    client_secrect: 'Client Secrect can not be empty.',
    refresh_token: 'Refresh Token can not be empty.',
    reporting_api_key: 'Reporting API Key can not be empty.',
    read_only_api_key: 'Read-Only API Key can not be empty.',
    report_key: 'Report Key can not be empty.',
    api_key: 'API Key can not be empty.',
    inventory_report_id: 'Inventory Report ID can not be empty.',
    publisher_reporting_api_key: 'Publisher Reporting API Key can not be empty.',
    ad_reporting_api_key: 'Ad Reporting API Key can not be empty.',
    user_id: 'User ID can not be empty.',
    user_signature: 'User Signature can not be empty.',
    report_api_skey: 'Report API SKey can not be empty.',
    report_api_secret: 'Report API Secret can not be empty.',
    user_name: 'User Name can not be empty.',
    secret_key: 'Secret Key can not be empty.',
    publisher_id: 'Publisher ID can not be empty.',
    consumer_key: 'Consumer Key can not be empty.',
    consumer_secret: 'Consumer Secret can not be empty.'
  },
  company: {
    company_empty: 'Company can not be empty.',
    update_success_namechange: 'Success, It will synchronize to Wire Transfer settings',
    update_success: 'Update successfully',
    first_login: 'Please complete company information first.',
    company_name_change: 'It will synchronize to Wire Transfer settings',
    country_empty: 'Country can not be empty.',
    email_empty: 'Email can not be empty.',
    email_pattern: 'Incorrect mailbox format.',
    address_empty: 'Address can not be empty.',
    website_empty: 'Website can not be empty.',
    website_pattern: 'Please input the full developer website URL in this field.',
    phone_empty: 'Phone can not be empty.'

  },
  promote: {
    company_empty: 'Company can not be empty',
    regions_empty: 'Country can not be empty.',
    email_empty: 'Email can not be empty.',
    first_login: 'Please complete promote information first.',
    email_pattern: 'Incorrect mailbox format.',
    save_success: 'Saved successfully'
  },
  finance: {
    update_success: 'Update successfully',
    paypal_empty: 'Please fill in your paypal account.',
    paypal_pattern: 'Incorrect mailbox format',
    store_url: 'Store Address can not be empty',
    beneficiary_name: 'Beneficiary Name can not be empty.',
    bank_name: 'Bank Name can not be empty',
    account_no: 'Account No. can not be empty',
    bank_address: 'Bank Address can not be empty',
    swift_code: 'SWIFT Code can not be empty.',
    not_agree: 'Must Agree to the aboce contract terms.',
    country_empty: 'Country can not be empty',
    network_error: 'Network problem, please try again later'
  },
  message: {
  }
}

const dict = {
  state: {
    msg: msg
  },
  mutations: {
    SET_DICT: (state, msg) => {
      state.msg = Object.assign(state.msg, msg)
    }
  },
  actions: {
    LoadDict ({ commit }) {
      return new Promise((resolve, reject) => {
        getMessageDict().then(response => {
          const result = response.data
          if (result) {
            commit('SET_DICT', result)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default dict
