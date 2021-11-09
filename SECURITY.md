# Security Policy

## Reporting a Vulnerability

First, ensure you're using the latest packages from the NodeJS Package Manager (NPM) repository. You can use the ``npm up`` command to update them.

Next, ensure the security issue is with Electrux itself and not with any of packages it uses. If it is with another package, the table below lists some of the places to report the vulnerability:

| Package | Link |
|-|-|
| Electron | https://github.com/electron/electron/blob/main/SECURITY.md |
| React | https://reactjs.org/docs/how-to-contribute.html#security-bugs |
| React Redux | https://github.com/reduxjs/react-redux/issues |
| Redux | https://github.com/reduxjs/redux/issues |
| Webpack | https://github.com/webpack/webpack/security/policy |

If you're sure the vulnerability is caused by Electrux, [open an issue](https://github.com/little-apps/Electrux/issues/new) and include the following:

 * **Who** the vulnerability affects.
 * **What** the security vulnerability is.
 * **Where** the security vulnerability exists.
 * **Why** this is considered a security vulnerability and not a bug or feature.
 * **When** the security vulnerability was discovered and when it should be fixed.
 * **How** can this security vulnerability be fixed.
