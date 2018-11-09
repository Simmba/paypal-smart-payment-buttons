/* @flow */

import { COUNTRY, LANG, DEFAULT_COUNTRY, COUNTRY_LANGS } from 'paypal-sdk-constants';

import type { ExpressRequest, ExpressResponse } from './types';

type FundingEligibility = {|
    
|};

function getFundingEligibility(req : ExpressRequest) : ?FundingEligibility {
    let encodedFundingEligibility = req.query.fundingEligibility;

    if (!encodedFundingEligibility || typeof encodedFundingEligibility !== 'string') {
        return;
    }

    return JSON.parse(
        Buffer.from(encodedFundingEligibility, 'base64').toString('utf8')
    );
}

function getNonce(res : ExpressResponse) : string {
    let nonce = res.locals && res.locals.nonce;

    if (!nonce || typeof nonce !== 'string') {
        nonce = '';
    }

    return nonce;
}

type ParamsType = {|
    clientID : string,
    locale? : {
        country : $Values<typeof COUNTRY>,
        lang : $Values<typeof LANG>
    }
|};

type RequestParams = {
    clientID : ?string,
    country : $Values<typeof COUNTRY>,
    lang : $Values<typeof LANG>,
    fundingEligibility : ?FundingEligibility,
    nonce : string
};

export function getParams(params : ParamsType, req : ExpressRequest, res : ExpressResponse) : RequestParams {
    let {
        clientID,
        locale = {}
    } = params;

    let {
        country = DEFAULT_COUNTRY,
        lang = COUNTRY_LANGS[country][0]
    } = locale;

    let fundingEligibility = getFundingEligibility(req);

    let nonce = getNonce(res);

    return {
        clientID,
        // $FlowFixMe
        lang,
        country,
        fundingEligibility,
        nonce
    };
}
