import { Notification, Provider, ProviderOptions } from 'apn';

var options: ProviderOptions = {
    cert: `${__dirname}/../../../certs/signerCert.pem`,
    key: `${__dirname}/../../../certs/signerKey.key`,
    production: true,
};

export const apnProvider = new Provider(options);

export const sendNotification = async (
    notificationProps: { topic: string } & Partial<Notification>,
    recipients: string | string[],
) => {
    try {
        const notification = new Notification();
        notification.topic = notificationProps.topic;
        const result = await apnProvider.send(notification, recipients);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.log(error);
    }
};
