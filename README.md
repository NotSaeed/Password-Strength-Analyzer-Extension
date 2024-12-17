# Password-Strength-Analyzer-Extension

**🚀 Installation**

1- Download the Extension
Clone this repository or download the latest release.
git clone **https://github.com/NotSaeed/Password-Strength-Analyzer-Extension.git**

2- Load into Browser

- Open your browser's extensions page (e.g., chrome://extensions/).

- Go to Manage Extension:

  ![image](https://github.com/user-attachments/assets/16143710-97f0-447b-b38f-c6a5e74b276d)

- Enable Developer Mode:

  ![image](https://github.com/user-attachments/assets/ae973fa1-797a-49b4-baf6-4b48cc61f025)


- Extract ZIP File


- Load unpacked

  ![image](https://github.com/user-attachments/assets/09edb5e0-1df0-43e4-be7b-478abaa2fc55)


- Select the extension folder.
  
-"Enter the file and then choose the file inside"



---------------------------------------------------------------------------------------------
Password Strength Analyzer
Secure.
Simple.
Seamless.
A browser extension that analyzes password strength and checks for leaks to help users create and maintain secure passwords.

📜 Overview
Password Strength Analyzer ensures your passwords are:

- Strong – Evaluates password strength in real time.
- Safe – Checks passwords against leaked databases using the Have I Been Pwned API.
- User-Friendly – Works seamlessly while logging in or creating accounts.


🔍 Features
Real-time Analysis: Detects if a password is leaked or weak during login/signup.
Color-Coded Indicators:

🟥 Red (Leaked) – Password found in breach databases.

🟥 Red (Weak) – Password is too weak (e.g., short or predictable).

🟨 Yellow (Moderate): Password meets minimum strength requirements.

🟩 Green (Strong): Password is strong and secure.

- Smart Suggestions: If a password is less than "Strong," the extension provides recommendations for improvement.


🛠️ How It Works
- Hashing Locally
Your password is hashed locally using SHA-1 encryption.

Only the first 5 characters of the hash are sent to the Have I Been Pwned API.

- Leak Detection
The API returns a list of hashes that match the first 5 characters.

A local comparison determines if your password has been leaked.

- Real-Time Feedback
Instant alerts for leaked passwords.

Immediate analysis of strength with user-friendly color-coded results.



🖥️ Technical Stack
Languages: JavaScript, HTML, CSS.

API: Have I Been Pwned API.

Security: Local SHA-1 hashing for privacy.


📸 Screenshots
- Password Leak Alert (Red - Leaked):
  
![image](https://github.com/user-attachments/assets/ac4af68b-7c0d-4f27-a929-87f866babe83).

- Password Weak Alert (Red - Weak):
  
![image](https://github.com/user-attachments/assets/bd5bb0a0-d032-4424-b651-2c0bf80eff43).

- Password Moderate Alert (Yellow - Moderate):
  
![image](https://github.com/user-attachments/assets/2e620324-b588-4bf1-b45e-95b1a0664954).

- Password Strong Alert (Green - Strong):
  
![image](https://github.com/user-attachments/assets/153eb16c-393a-48d8-bd82-3c2aa4250786).

- Password Suggestion:
  
![image](https://github.com/user-attachments/assets/5b6c1016-4a98-4309-9425-c81278857e8f).


- Password Strength Feedback

🟥 Weak (Red).

🟨 Moderate (Yellow).

🟩 Strong (Green).


🌟 Why Use Password Strength Analyzer?
- Privacy First: Passwords are never sent in full to any server.
  
- Real-Time Alerts: Detect leaked or weak passwords immediately.
  
- Easy Integration: Works silently in the background.
  
- Improved Security: Encourages strong and secure password habits.


💡 Future Enhancements
- Support for additional password strength algorithms.
  
- Customizable strength rules for advanced users.
  
- Integration with password managers.

📧 Contact Us
For feedback or contributions, feel free to open an issue or contact:

- Team Name: Mohammed Saeed & Abdullah Ba Nafea
  
- Email: mohammed0911saeed@gmail.com

Secure your accounts today with Password Strength Analyzer! 🚀

Protect Your Passwords Now!
