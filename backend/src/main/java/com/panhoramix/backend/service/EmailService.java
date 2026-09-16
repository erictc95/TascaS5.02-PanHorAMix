package com.panhoramix.backend.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final Resend resend;

    @Value("${app.mail.from}")
    private String from;

    public EmailService(
            @Value("${RESEND_API_KEY}") String resendApiKey
    ) {
        this.resend = new Resend(resendApiKey);
    }

    public void sendDirectorNote(
            String recipientEmail,
            String username,
            String mediaTitle,
            String directorNote
    ) {

        String emailText = """
                Hello %s,

                Your media "%s" has been removed from PanHorAMix.

                Director's Note:
                %s

                If you believe this removal was made in error, you can reply to this email to contact PHAM.

                Regards,
                PHAM Director
                PanHorAMix
                """.formatted(
                username,
                mediaTitle,
                directorNote
        );

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(from)
                .to(recipientEmail)
                .subject("PHAM — Media removed")
                .text(emailText)
                .build();

        try {
            resend.emails().send(params);
        } catch (ResendException e) {
            throw new RuntimeException(
                    "Failed to send director note email",
                    e
            );
        }
    }

    public void sendUserDeletionNote(
            String recipientEmail,
            String username,
            String directorNote
    ) {

        String emailText = """
                Hello %s,

                Your PanHorAMix account has been permanently removed.

                Director's Note:
                %s

                If you believe this removal was made in error, you can reply to this email to contact PHAM.

                Regards,
                PHAM Director
                PanHorAMix
                """.formatted(
                username,
                directorNote
        );

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(from)
                .to(recipientEmail)
                .subject("PHAM — Account removed")
                .text(emailText)
                .build();

        try {
            resend.emails().send(params);
        } catch (ResendException e) {
            throw new RuntimeException(
                    "Failed to send account deletion email",
                    e
            );
        }
    }
}