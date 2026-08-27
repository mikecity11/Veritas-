# Contract notes

`VeritasRegistry.py` is deliberately small: it anchors the API's SHA-256 verification identifier plus the research question. It does not put the full evidence text on-chain, which keeps updates and privacy manageable.

The first-line dependency pin and contract syntax follow the current GenLayer Intelligent Contract documentation. Test it in GenLayer Studio before relying on it for any real workflow. For a local Python test suite, GenLayer documents `genlayer-test` (Python 3.12+); it is not bundled with the Node MVP to avoid pinning an unverified toolchain version.
