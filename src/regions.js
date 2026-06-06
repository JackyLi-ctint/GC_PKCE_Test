// Shared region list used by both pkce.html and framework.html
const GC_REGIONS = [
  { value: 'us-east-1',    login: 'login.mypurecloud.com',        api: 'api.mypurecloud.com',        apps: 'apps.mypurecloud.com',        label: 'US East \u2013 Virginia (us-east-1)' },
  { value: 'us-east-2',    login: 'login.use2.us-gov-pure.cloud', api: 'api.use2.us-gov-pure.cloud', apps: 'apps.use2.us-gov-pure.cloud', label: 'US East 2 \u2013 Ohio GovCloud (us-east-2)' },
  { value: 'us-west-2',    login: 'login.usw2.pure.cloud',        api: 'api.usw2.pure.cloud',        apps: 'apps.usw2.pure.cloud',        label: 'US West \u2013 Oregon (us-west-2)' },
  { value: 'ca-central-1', login: 'login.cac1.pure.cloud',        api: 'api.cac1.pure.cloud',        apps: 'apps.cac1.pure.cloud',        label: 'Canada \u2013 Central (ca-central-1)' },
  { value: 'eu-west-1',    login: 'login.mypurecloud.ie',         api: 'api.mypurecloud.ie',         apps: 'apps.mypurecloud.ie',         label: 'Europe \u2013 Ireland (eu-west-1)' },
  { value: 'eu-west-2',    login: 'login.euw2.pure.cloud',        api: 'api.euw2.pure.cloud',        apps: 'apps.euw2.pure.cloud',        label: 'Europe \u2013 London (eu-west-2)' },
  { value: 'eu-central-1', login: 'login.mypurecloud.de',         api: 'api.mypurecloud.de',         apps: 'apps.mypurecloud.de',         label: 'Europe \u2013 Frankfurt (eu-central-1)' },
  { value: 'eu-central-2', login: 'login.euc2.pure.cloud',        api: 'api.euc2.pure.cloud',        apps: 'apps.euc2.pure.cloud',        label: 'Europe \u2013 Zurich (eu-central-2)' },
  { value: 'ap-south-1',   login: 'login.aps1.pure.cloud',        api: 'api.aps1.pure.cloud',        apps: 'apps.aps1.pure.cloud',        label: 'Asia Pacific \u2013 Mumbai (ap-south-1)' },
  { value: 'ap-northeast-1', login: 'login.mypurecloud.jp',       api: 'api.mypurecloud.jp',         apps: 'apps.mypurecloud.jp',         label: 'Asia Pacific \u2013 Tokyo (ap-northeast-1)' },
  { value: 'ap-northeast-2', login: 'login.apne2.pure.cloud',     api: 'api.apne2.pure.cloud',       apps: 'apps.apne2.pure.cloud',       label: 'Asia Pacific \u2013 Seoul (ap-northeast-2)' },
  { value: 'ap-northeast-3', login: 'login.apne3.pure.cloud',     api: 'api.apne3.pure.cloud',       apps: 'apps.apne3.pure.cloud',       label: 'Asia Pacific \u2013 Osaka (ap-northeast-3)' },
  { value: 'ap-southeast-2', login: 'login.mypurecloud.com.au',   api: 'api.mypurecloud.com.au',     apps: 'apps.mypurecloud.com.au',     label: 'Asia Pacific \u2013 Sydney (ap-southeast-2)' },
  { value: 'ap-southeast-1', login: 'login.apse1.pure.cloud',     api: 'api.apse1.pure.cloud',       apps: 'apps.apse1.pure.cloud',       label: 'Asia Pacific \u2013 Singapore (ap-southeast-1)' },
  { value: 'sa-east-1',    login: 'login.sae1.pure.cloud',        api: 'api.sae1.pure.cloud',        apps: 'apps.sae1.pure.cloud',        label: 'South America \u2013 S\u00e3o Paulo (sa-east-1)' },
  { value: 'me-central-1', login: 'login.mec1.pure.cloud',        api: 'api.mec1.pure.cloud',        apps: 'apps.mec1.pure.cloud',        label: 'Middle East \u2013 UAE (me-central-1)' },
];

function buildRegionSelect(selectEl, placeholder = '-- Select Region --') {
  const blank = document.createElement('option');
  blank.value = '';
  blank.disabled = true;
  blank.selected = true;
  blank.textContent = placeholder;
  selectEl.appendChild(blank);
  GC_REGIONS.forEach(r => {
    const opt = document.createElement('option');
    opt.value       = r.value;
    opt.dataset.login = r.login;
    opt.dataset.api   = r.api;
    opt.dataset.apps  = r.apps;
    opt.textContent = r.label;
    selectEl.appendChild(opt);
  });
}

export { GC_REGIONS, buildRegionSelect };
