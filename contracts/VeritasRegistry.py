# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""Minimal Veritas verification registry for GenLayer Studio.

Deploy with the address that may record evidence hashes. This contract stores an
anchor identifier and its human-readable claim; the full source bundle remains
off-chain, where it can be inspected and updated independently.
"""
from genlayer import *


class VeritasRegistry(gl.Contract):
    admin: Address
    latest_hash: str
    latest_claim: str

    def __init__(self, initial_admin: Address):
        self.admin = initial_admin
        self.latest_hash = ""
        self.latest_claim = ""

    @gl.public.view
    def get_latest_anchor(self) -> str:
        return self.latest_hash

    @gl.public.view
    def get_latest_claim(self) -> str:
        return self.latest_claim

    @gl.public.write
    def record_anchor(self, evidence_hash: str, claim: str) -> None:
        if gl.message.sender_address != self.admin:
            raise gl.vm.UserError("Only the Veritas admin may record an anchor.")
        if len(evidence_hash) != 71 or not evidence_hash.startswith("sha256:"):
            raise gl.vm.UserError("Expected a sha256: verification identifier.")
        if len(claim) == 0 or len(claim) > 300:
            raise gl.vm.UserError("Claim must be between 1 and 300 characters.")
        self.latest_hash = evidence_hash
        self.latest_claim = claim

    @gl.public.write
    def set_admin(self, new_admin: Address) -> None:
        if gl.message.sender_address != self.admin:
            raise gl.vm.UserError("Only the current admin may change the admin.")
        self.admin = new_admin
