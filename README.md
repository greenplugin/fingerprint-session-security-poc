# Proof of Concept: Device Fingerprint Session Extra Security

This repository contains a proof of concept for using device fingerprinting to increase the security of authentication tokens.

#### Demo: https://fingerprint-session-poc.web.app/

## Introduction
Traditional methods of authentication (token or jwt), are vulnerable to some forms of attacks like jwt spoofing, and man-in-the-middle attacks. 
Device fingerprinting can provide an additional layer of security to authentication tokens by identifying the device that is accessing the system.

Device fingerprinting involves collecting various characteristics of the device, such as the operating system, browser version, 
screen resolution, and installed fonts, and using these characteristics to generate a unique identifier for the device. 
This identifier can then be used to extra verify the authenticity of the request.

## Proof of Concept
The proof of concept in this repository demonstrates how device fingerprinting can be used to increase the security of authentication tokens. 
The proof of concept consists of two components:

1. A server that generates authentication tokens and verifies device fingerprints.
2. A client that requests authentication tokens and sends device fingerprints.

The server is implemented using Node.js and Goggle apps engine, and the client is implemented using Angular.

## Installation and Usage
tbd

## Conclusion
This proof of concept demonstrates how device fingerprinting can be used to increase the security of authentication tokens. 
By identifying the device that is accessing the system, device fingerprinting can prevent unauthorized access and reduce 
the risk of various forms of attacks. However, device fingerprinting is not foolproof, and should be used in 
conjunction with other security measures, such as strong passwords and 2FA.
