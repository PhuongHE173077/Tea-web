export const FormMail = (webName, webUrl, email, dueTime) => {
  return `
    <div style="font-family: 'Arial', sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; max-width: 500px; margin: 40px auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); background-color: #f9f9f9;">
      <h2 style="color: #333; text-align: center; margin-bottom: 25px; font-weight: 600;">
        <span style="color: #007bff;">${webName}</span> - Xác minh tài khoản
      </h2>

      <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
        Xin chào! Cảm ơn bạn đã đăng ký tài khoản tại <span style="font-weight: bold; color: #007bff;">${webName}</span>.
        Vui lòng xác minh email của bạn để hoàn tất quá trình đăng ký.
      </p>

      <div style="background-color: #f0f8ff; padding: 20px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #b0c4de;">
        <p style="font-size: 14px; color: #444; margin-bottom: 10px;">
          <strong>Email:</strong> ${email}
        </p>
      
        <p style="font-size: 14px; color: #444;">
          <strong>Thời gian hết hạn liên kết:</strong> ${dueTime}
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 25px;">
        <a href="${webUrl}" style="background-color: #007bff; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          Xác minh tài khoản
        </a>
      </div>

      <p style="font-size: 14px; color: #777; line-height: 1.5; text-align: center;">
        Nếu bạn không yêu cầu xác minh tài khoản, vui lòng bỏ qua email này. Liên kết sẽ hết hạn sau ${dueTime}.
      </p>

      <p style="font-size: 14px; color: #555; text-align: center; margin-top: 30px;">
        Trân trọng,<br>Đội ngũ <span style="font-weight: bold; color: #007bff;">${webName}</span>
      </p>
    </div>
  `;
};
