import { Notification, Provider, ProviderOptions } from 'apn';

var options: ProviderOptions = {
    cert: `${__dirname}/../../../certs/signerCert.pem`,
    key: `${__dirname}/../../../certs/signerKey.key`,
    production: true,
};

export const apnProvider = new Provider(options);

export const sendNotification = async (
    notificationProps: { alert: string } & Partial<Notification>,
    recipients: string | string[],
) => {
    try {
        const notification = new Notification();
        notification.alert = notificationProps.alert;
        notification.topic = 'com.zajil.passes';
        const result = await apnProvider.send(notification, recipients);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.log(error);
    }
};

export const sendUpdatePassNotification = async (deviceToken: string) => {
    const notification = new Notification();
    notification.topic = 'com.zajil.passes';

    try {
        const result = await apnProvider.send(notification, deviceToken).catch((error) => {
            throw new Error(error);
        });
        console.log(JSON.stringify(result || '', null, 2));
    } catch (error) {
        console.log(error);
    }
};
