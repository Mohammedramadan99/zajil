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

        notification.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        notification.badge = 3;
        notification.sound = "ping.aiff";
        notification.alert = "\uD83D\uDCE7 \u2709 You have a new message";
        notification.payload = {'messageFrom': 'John Appleseed'};

        // apply notification props
        Object.assign(notification, notificationProps);

        const result = await apnProvider.send(notification, recipients);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.log(error);
    }
};
