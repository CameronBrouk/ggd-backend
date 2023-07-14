import { MailDataRequired } from '@sendgrid/mail'
import * as sendgrid from '@sendgrid/mail'
import { environment } from '../environment'

const DEFAULT_FROM = { email: 'info@stlswing.dance', name: 'STL Swing' }

type GetArrayElement<T> = T extends (infer U)[] ? U : any

export type SendgridRequest = {
  to: string[] // can take emails OR UIDS
  from?: { email: string; name: string }
  bcc?: string[] // can take emails OR UIds
  cc?: string[] // can take emails OR UIds
  subject: string
  text: string
  // This is the html part that uses handlebar templates
  html?: string
  attachments?: SendgridAttachment[]
}

/**
@param content Must be base64 encoded
 @param fileName -> REQUIRED. must be a string, cannot contain CRLF characters,
 @param type -> must be a string, cannot contain CRLL characters
 @param disposition -> The content-disposition of your attachment defines how you would like the attachment to be displayed. For example, "inline" results in the attached file being displayed automatically within the message while "attachment" results in the attached file requiring some action to be taken before it is displayed (e.g. opening or downloading the file). attachments.disposition always defaults to "attachment". Can be either "attachment" or "inline".
 @param content_id -> The content_id is a unique id that you specify for the attachment. This is used when the disposition is set to "inline" and the attachment is an image, allowing the file to be displayed within the body of your email. For example, <img src="cid:ii_139db99fdb5c3704"></img>
 @example
      const attachedImage = {
        content: 'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KCiAgICA8aGVhZD4KICAgICAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICAgICAgPG1ldGEgaHR0cC1lcXVpdj0iWC1VQS1Db21wYXRpYmxlIiBjb250ZW50PSJJRT1lZGdlIj4KICAgICAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCI+CiAgICAgICAgPHRpdGxlPkRvY3VtZW50PC90aXRsZT4KICAgIDwvaGVhZD4KCiAgICA8Ym9keT4KCiAgICA8L2JvZHk+Cgo8L2h0bWw+Cg==',
        filename: 'ticket-1234.jpg',
        type: 'image/jpeg',
        disposition: 'attachment',
        contentId: 'uniqueID',
      }
 */
type SendgridAttachment = GetArrayElement<
  NonNullable<MailDataRequired['attachments']>
>

/**
 *
@example
sendSendgridEmail({
    to: ['email1@example.com', 'email2@example.com'],
    from: { email: 'info@stlswing.dance', name: 'STL Swing' },
    subject: 'Email Subject',
    content: {
      type: 'text/html',
      value: '<p>example shit</p>',
    },
})
 */
export const sendSendgridEmail = async ({
  to,
  from,
  ...message
}: SendgridRequest) => {
  sendgrid.setApiKey(environment.SENDGRID_KEY)
  const [sendgridResponse] = await sendgrid.send({
    to,
    ...message,
    from: from || DEFAULT_FROM,
  })

  return sendgridResponse
}
