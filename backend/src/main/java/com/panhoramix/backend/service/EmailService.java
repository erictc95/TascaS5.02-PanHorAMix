package com.panhoramix.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    public void sendDirectorNote(
            String recipientEmail,
            String username,
            String mediaTitle,
            String directorNote
    ) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(from);
        message.setTo(recipientEmail);
        message.setSubject("PHAM — Media removed");

        message.setText("""
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
        ));

        mailSender.send(message);
    }

    public void sendUserDeletionNote(
            String recipientEmail,
            String username,
            String directorNote
    ){
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(from);
        message.setTo(recipientEmail);

        message.setSubject("PHAM — Account removed");

        message.setText("""
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
        ));

        mailSender.send(message);
    }
}
