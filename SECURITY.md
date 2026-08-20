# Security policy

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability or include production
credentials in a report. Use GitHub's private vulnerability reporting for this
repository:

<https://github.com/PtiCadri/studio/security/advisories/new>

Include the affected component, reproduction steps, expected impact, and any
suggested mitigation. Do not access, modify, or retain data belonging to other
people while investigating.

## Supported version

Security fixes target the current `production` branch. Older branches and
historical deployments are not maintained.

## Secret handling

Production secrets belong only in the untracked `.env.production` file on the
deployment host or an equivalent secret manager. If a secret is exposed,
rotate it at the provider, update the deployment, verify the replacement, and
then revoke the old value.
