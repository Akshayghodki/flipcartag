import paytmchecksum from '../paytm/PaytmChecksum.js';
import { paytmParams, paytmMerchantkey } from '../index.js';
import formidable from 'formidable';
import https from 'https';

const DB_URL = process.env.DB_URL;

export const addPaymentGateway = async (request, response) => {
    try {
        const paytmCheckSum = await paytmchecksum.generateSignature(paytmParams, paytmMerchantkey);
        const params = {
            ...paytmParams,
            'CHECKSUMHASH': paytmCheckSum
        };
        response.json(params);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
}


export const paymentResponse = async (request, response) => {
    const form = formidable();

    form.parse(request, async (err, fields) => {
        if (err) {
            console.error(err);
            response.status(400).json({ error: "Bad Request" });
            return;
        }
        
        const paytmCheckSum = fields.CHECKSUMHASH;
        delete fields.CHECKSUMHASH;

        const isVerifySignature = await paytmchecksum.verifySignature(fields, paytmMerchantkey, paytmCheckSum);
        if (isVerifySignature) {
            let paytmParams = {
                MID: fields.MID,
                ORDERID: fields.ORDERID
            };

            try {
                const checksum = await paytmchecksum.generateSignature(paytmParams, paytmMerchantkey);
                paytmParams["CHECKSUMHASH"] = checksum;

                const post_data = JSON.stringify(paytmParams);

                const options = {
                    hostname: 'securegw-stage.paytm.in',
                    port: 443,
                    path: '/order/status',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };

                let res = "";
                const post_req = https.request(options, function (post_res) {
                    post_res.on('data', function (chunk) {
                        res += chunk;
                    });

                    post_res.on('end', function () {
                        let result = JSON.parse(res);
                        console.log(result);
                        // response.redirect(`http://localhost:3000/`);
                        response.redirect(`${DB_URL}/`);
                    });
                });
                post_req.write(post_data);
                post_req.end();
            } catch (error) {
                console.error(error);
                response.status(500).json({ error: "Internal Server Error" });
            }
        } else {
            console.log("Checksum Mismatched");
            response.status(400).json({ error: "Checksum Mismatched" });
        }
    });
}
// export const paymentResponse = (request, response) => {
//     const form = new formidable.IncomingForm();
//     form.parse(request, async (err, fields, files) => {
//         if (err) {
//             console.error(err);
//             response.status(400).json({ error: "Bad Request" });
//             return;
//         }
        
//         const paytmCheckSum = fields.CHECKSUMHASH;
//         delete fields.CHECKSUMHASH;

//         const isVerifySignature = await paytmchecksum.verifySignature(fields, paytmMerchantkey, paytmCheckSum);
//         if (isVerifySignature) {
//             let paytmParams = {};
//             paytmParams["MID"] = fields.MID;
//             paytmParams["ORDERID"] = fields.ORDERID;

//             try {
//                 const checksum = await paytmchecksum.generateSignature(paytmParams, paytmMerchantkey);
//                 paytmParams["CHECKSUMHASH"] = checksum;

//                 const post_data = JSON.stringify(paytmParams);

//                 const options = {
//                     hostname: 'securegw-stage.paytm.in',
//                     port: 443,
//                     path: '/order/status',
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Content-Length': post_data.length
//                     }
//                 };

//                 let res = "";
//                 const post_req = https.request(options, function (post_res) {
//                     post_res.on('data', function (chunk) {
//                         res += chunk;
//                     });

//                     post_res.on('end', function () {
//                         let result = JSON.parse(res);
//                         console.log(result);
//                         response.redirect(`http://localhost:3000/`);
//                     });
//                 });
//                 post_req.write(post_data);
//                 post_req.end();
//             } catch (error) {
//                 console.error(error);
//                 response.status(500).json({ error: "Internal Server Error" });
//             }
//         } else {
//             console.log("Checksum Mismatched");
//             response.status(400).json({ error: "Checksum Mismatched" });
//         }
//     });
// }










// import paytmchecksum from '../paytm/PaytmChecksum.js';
// import { paytmParams, paytmMerchantkey } from '../index.js';
// import formidable from 'formidable';
// import https from 'https';



// export const addPaymentGateway = async (request, response) => {
//     const paytmCheckSum = await paytmchecksum.generateSignature(paytmParams, paytmMerchantkey);
//     try {
//         const params = {
//             ...paytmParams,
//             'CHECKSUMHASH': paytmCheckSum
//         };
//         response.json(params);
//     } catch (error) {
//         console.log(error);
//     }
// }

// export const paymentResponse = (request, response) => {

//     const form = new formidable.IncomingForm();
//     const paytmCheckSum = request.body.CHECKSUMHASH;
//     delete request.body.CHECKSUMHASH;

//     const isVerifySignature = paytmchecksum.verifySignature(request.body, 'bKMfNxPPf_QdZppa', paytmCheckSum);
//     if (isVerifySignature) {
//         let paytmParams = {};
//         paytmParams["MID"] = request.body.MID;
//         paytmParams["ORDERID"] = request.body.ORDERID;

//         paytmchecksum.generateSignature(paytmParams, 'bKMfNxPPf_QdZppa').then(function (checksum) {

//             paytmParams["CHECKSUMHASH"] = checksum;

//             const post_data = JSON.stringify(paytmParams);

//             const options = {
//                 hostname: 'securegw-stage.paytm.in',
//                 port: 443,
//                 path: '/order/status',
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Content-Length': post_data.length
//                 }
//             };

//             let res = "";
//             const post_req = https.request(options, function (post_res) {
//                 post_res.on('data', function (chunk) {
//                     res += chunk;
//                 });

//                 post_res.on('end', function () {
//                     let result = JSON.parse(res);
//                     console.log(result);
//                     response.redirect(`http://localhost:3000/`)
//                 });
//             });
//             post_req.write(post_data);
//             post_req.end();
//         });
//     } else {
//         console.log("Checksum Mismatched");
//     }
// }