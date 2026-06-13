from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Any

PROVIDER_CUSTOMER_FIELDS = [
    "providerCompany",
    "providerName",
    "providerTitle",
    "providerAddress",
    "customerCompany",
    "customerName",
    "customerTitle",
    "customerAddress",
]

GOVERNANCE_FIELDS = ["effectiveDate", "governingLaw", "chosenCourts"]


@dataclass(frozen=True)
class DocumentTypeConfig:
    id: str
    name: str
    description: str
    filename: str
    field_names: tuple[str, ...]
    defaults: dict[str, str]
    preview_style: str  # "nda" | "provider-customer" | "generic"


def _today() -> str:
    return date.today().isoformat()


def _pc_defaults(**extra: str) -> dict[str, str]:
    base = {field: "" for field in PROVIDER_CUSTOMER_FIELDS + GOVERNANCE_FIELDS}
    base["effectiveDate"] = _today()
    base.update(extra)
    return base


DOCUMENT_TYPES: dict[str, DocumentTypeConfig] = {
    "mutual-nda": DocumentTypeConfig(
        id="mutual-nda",
        name="Mutual Non-Disclosure Agreement",
        description="Common Paper standard Mutual NDA for sharing confidential information between two parties.",
        filename="Mutual-NDA.md",
        field_names=(
            "party1Company",
            "party1Name",
            "party1Title",
            "party1Address",
            "party2Company",
            "party2Name",
            "party2Title",
            "party2Address",
            "purpose",
            "effectiveDate",
            "mndaTerm",
            "termOfConfidentiality",
            "governingLaw",
            "jurisdiction",
        ),
        defaults={
            "party1Company": "",
            "party1Name": "",
            "party1Title": "",
            "party1Address": "",
            "party2Company": "",
            "party2Name": "",
            "party2Title": "",
            "party2Address": "",
            "purpose": "Evaluating whether to enter into a business relationship with the other party.",
            "effectiveDate": _today(),
            "mndaTerm": "1 year from Effective Date",
            "termOfConfidentiality": "1 year from Effective Date",
            "governingLaw": "",
            "jurisdiction": "",
        },
        preview_style="nda",
    ),
    "csa": DocumentTypeConfig(
        id="csa",
        name="Cloud Service Agreement",
        description="Common Paper standard Cloud Service Agreement (CSA) for SaaS and cloud-based software subscriptions.",
        filename="CSA.md",
        field_names=(
            *PROVIDER_CUSTOMER_FIELDS,
            "effectiveDate",
            "subscriptionPeriod",
            "cloudServiceDescription",
            "fees",
            "governingLaw",
            "chosenCourts",
        ),
        defaults=_pc_defaults(
            subscriptionPeriod="1 year",
            cloudServiceDescription="",
            fees="",
        ),
        preview_style="provider-customer",
    ),
    "pilot": DocumentTypeConfig(
        id="pilot",
        name="Pilot Agreement",
        description="Common Paper standard Pilot Agreement for time-limited paid or unpaid product trials.",
        filename="Pilot-Agreement.md",
        field_names=(
            *PROVIDER_CUSTOMER_FIELDS,
            "effectiveDate",
            "pilotPeriod",
            "productDescription",
            "generalCapAmount",
            "governingLaw",
            "chosenCourts",
        ),
        defaults=_pc_defaults(
            pilotPeriod="30 days",
            productDescription="",
            generalCapAmount="$1,000",
        ),
        preview_style="provider-customer",
    ),
    "design-partner": DocumentTypeConfig(
        id="design-partner",
        name="Design Partner Agreement",
        description="Common Paper standard Design Partner Agreement for early-stage product collaboration with design partners.",
        filename="design-partner-agreement.md",
        field_names=(
            *PROVIDER_CUSTOMER_FIELDS,
            "effectiveDate",
            "programDescription",
            "designPartnerTerm",
            "governingLaw",
            "chosenCourts",
        ),
        defaults=_pc_defaults(programDescription="", designPartnerTerm="6 months"),
        preview_style="generic",
    ),
    "sla": DocumentTypeConfig(
        id="sla",
        name="Service Level Agreement",
        description="Common Paper standard Service Level Agreement (SLA) defining uptime commitments and remedies.",
        filename="sla.md",
        field_names=(
            *PROVIDER_CUSTOMER_FIELDS,
            "effectiveDate",
            "uptimeCommitment",
            "serviceCredits",
            "governingLaw",
            "chosenCourts",
        ),
        defaults=_pc_defaults(uptimeCommitment="99.9%", serviceCredits=""),
        preview_style="generic",
    ),
    "psa": DocumentTypeConfig(
        id="psa",
        name="Professional Services Agreement",
        description="Common Paper standard Professional Services Agreement (PSA) for scoped consulting and services engagements.",
        filename="psa.md",
        field_names=(
            *PROVIDER_CUSTOMER_FIELDS,
            "effectiveDate",
            "servicesDescription",
            "projectScope",
            "fees",
            "governingLaw",
            "chosenCourts",
        ),
        defaults=_pc_defaults(servicesDescription="", projectScope="", fees=""),
        preview_style="generic",
    ),
    "dpa": DocumentTypeConfig(
        id="dpa",
        name="Data Processing Agreement",
        description="Common Paper standard Data Processing Agreement (DPA) for GDPR-compliant data processing arrangements.",
        filename="DPA.md",
        field_names=(
            *PROVIDER_CUSTOMER_FIELDS,
            "effectiveDate",
            "processingPurpose",
            "dataCategories",
            "governingLaw",
            "chosenCourts",
        ),
        defaults=_pc_defaults(processingPurpose="", dataCategories=""),
        preview_style="generic",
    ),
    "software-license": DocumentTypeConfig(
        id="software-license",
        name="Software License Agreement",
        description="Common Paper standard Software License Agreement for licensing software to customers.",
        filename="Software-License-Agreement.md",
        field_names=(
            *PROVIDER_CUSTOMER_FIELDS,
            "effectiveDate",
            "subscriptionPeriod",
            "permittedUses",
            "licenseLimits",
            "governingLaw",
            "chosenCourts",
        ),
        defaults=_pc_defaults(
            subscriptionPeriod="1 year",
            permittedUses="Internal business purposes",
            licenseLimits="",
        ),
        preview_style="generic",
    ),
    "partnership": DocumentTypeConfig(
        id="partnership",
        name="Partnership Agreement",
        description="Common Paper standard Partnership Agreement for channel, referral, and reseller partnerships.",
        filename="Partnership-Agreement.md",
        field_names=(
            *PROVIDER_CUSTOMER_FIELDS,
            "effectiveDate",
            "partnershipType",
            "referralTerms",
            "governingLaw",
            "chosenCourts",
        ),
        defaults=_pc_defaults(partnershipType="", referralTerms=""),
        preview_style="generic",
    ),
    "baa": DocumentTypeConfig(
        id="baa",
        name="Business Associate Agreement",
        description="Common Paper standard Business Associate Agreement (BAA) for HIPAA-compliant handling of protected health information.",
        filename="BAA.md",
        field_names=(
            *PROVIDER_CUSTOMER_FIELDS,
            "effectiveDate",
            "hipaaServices",
            "permittedUses",
            "governingLaw",
            "chosenCourts",
        ),
        defaults=_pc_defaults(hipaaServices="", permittedUses=""),
        preview_style="generic",
    ),
    "ai-addendum": DocumentTypeConfig(
        id="ai-addendum",
        name="AI Addendum",
        description="Common Paper standard AI Addendum governing the use of AI and machine learning features within a contract.",
        filename="AI-Addendum.md",
        field_names=(
            *PROVIDER_CUSTOMER_FIELDS,
            "effectiveDate",
            "aiFeatures",
            "modelTrainingPolicy",
            "governingLaw",
            "chosenCourts",
        ),
        defaults=_pc_defaults(aiFeatures="", modelTrainingPolicy=""),
        preview_style="generic",
    ),
}


def get_document_type(document_type_id: str | None) -> DocumentTypeConfig | None:
    if not document_type_id:
        return None
    return DOCUMENT_TYPES.get(document_type_id)


def list_types() -> list[DocumentTypeConfig]:
    return list(DOCUMENT_TYPES.values())


def empty_fields(document_type_id: str) -> dict[str, str]:
    config = DOCUMENT_TYPES[document_type_id]
    return dict(config.defaults)


def merge_fields(current: dict[str, str], updates: dict[str, str], document_type_id: str) -> dict[str, str]:
    config = DOCUMENT_TYPES[document_type_id]
    merged = {**empty_fields(document_type_id), **current}
    for key in config.field_names:
        value = updates.get(key, "")
        if value and str(value).strip():
            merged[key] = str(value).strip()
    return merged


def is_complete(fields: dict[str, str], document_type_id: str) -> bool:
    config = DOCUMENT_TYPES[document_type_id]
    return all(str(fields.get(key, "")).strip() for key in config.field_names)


def field_labels(document_type_id: str) -> dict[str, str]:
    labels = {
        "party1Company": "Party 1 Company",
        "party1Name": "Party 1 Signatory",
        "party1Title": "Party 1 Title",
        "party1Address": "Party 1 Notice Address",
        "party2Company": "Party 2 Company",
        "party2Name": "Party 2 Signatory",
        "party2Title": "Party 2 Title",
        "party2Address": "Party 2 Notice Address",
        "providerCompany": "Provider Company",
        "providerName": "Provider Signatory",
        "providerTitle": "Provider Title",
        "providerAddress": "Provider Notice Address",
        "customerCompany": "Customer Company",
        "customerName": "Customer Signatory",
        "customerTitle": "Customer Title",
        "customerAddress": "Customer Notice Address",
        "purpose": "Purpose",
        "effectiveDate": "Effective Date",
        "mndaTerm": "MNDA Term",
        "termOfConfidentiality": "Term of Confidentiality",
        "governingLaw": "Governing Law",
        "jurisdiction": "Jurisdiction",
        "chosenCourts": "Chosen Courts",
        "subscriptionPeriod": "Subscription Period",
        "cloudServiceDescription": "Cloud Service Description",
        "fees": "Fees",
        "pilotPeriod": "Pilot Period",
        "productDescription": "Product Description",
        "generalCapAmount": "General Cap Amount",
        "programDescription": "Program Description",
        "designPartnerTerm": "Design Partner Term",
        "uptimeCommitment": "Uptime Commitment",
        "serviceCredits": "Service Credits",
        "servicesDescription": "Services Description",
        "projectScope": "Project Scope",
        "processingPurpose": "Processing Purpose",
        "dataCategories": "Data Categories",
        "permittedUses": "Permitted Uses",
        "licenseLimits": "License Limits",
        "partnershipType": "Partnership Type",
        "referralTerms": "Referral Terms",
        "hipaaServices": "HIPAA Services",
        "aiFeatures": "AI Features",
        "modelTrainingPolicy": "Model Training Policy",
    }
    config = DOCUMENT_TYPES[document_type_id]
    return {key: labels.get(key, key) for key in config.field_names}


def build_detection_catalog_text() -> str:
    lines = []
    for config in DOCUMENT_TYPES.values():
        lines.append(f"- {config.id}: {config.name} — {config.description}")
    return "\n".join(lines)


def build_system_prompt(document_type_id: str) -> str:
    config = DOCUMENT_TYPES[document_type_id]
    field_lines = "\n".join(
        f"- {label}" for label in field_labels(document_type_id).values()
    )
    party_hint = (
        "Party 1 and Party 2"
        if document_type_id == "mutual-nda"
        else "Provider and Customer"
    )
    return f"""You are Prelegal, a friendly legal document assistant helping users draft a {config.name} (Common Paper standard).

Your job is to gather these fields through natural conversation, one or two at a time:
{field_lines}

Rules:
- Ask follow-up questions until all fields are collected.
- Extract any values the user provides into the fields object.
- Use today's date as default effective date if not specified.
- When all fields are filled, confirm the document is ready and set is_complete to true.
- Keep replies concise and conversational.
- Start with {party_hint} organization names when beginning field collection.
"""


DETECTION_SYSTEM_PROMPT = f"""You are Prelegal, a friendly legal document assistant.

The user wants to draft a legal agreement. Available document types:
{build_detection_catalog_text()}

Your job:
1. Determine which document type the user wants from their message.
2. If unclear, ask a brief clarifying question and set document_type to empty string "".
3. Once confident, set document_type to the matching id and ask the first field question for that document.
4. Populate fields with any values already provided.

Rules:
- Keep replies concise and conversational.
- Do not invent field values.
- If the user explicitly asks for an NDA or non-disclosure agreement, use mutual-nda.
"""


def build_response_schema(document_type_id: str | None) -> dict[str, Any]:
    if document_type_id:
        config = DOCUMENT_TYPES[document_type_id]
        field_props = {name: {"type": "string"} for name in config.field_names}
        return {
            "type": "object",
            "properties": {
                "assistant_message": {"type": "string"},
                "document_type": {"type": "string", "enum": [document_type_id]},
                "fields": {
                    "type": "object",
                    "properties": field_props,
                    "required": list(config.field_names),
                    "additionalProperties": False,
                },
                "is_complete": {"type": "boolean"},
            },
            "required": ["assistant_message", "document_type", "fields", "is_complete"],
            "additionalProperties": False,
        }

    type_ids = list(DOCUMENT_TYPES.keys())
    # Allow the LLM to return any known field from any document type during detection,
    # so values the user mentions before the type is confirmed are not silently dropped.
    all_field_props = {
        name: {"type": "string"}
        for config in DOCUMENT_TYPES.values()
        for name in config.field_names
    }
    return {
        "type": "object",
        "properties": {
            "assistant_message": {"type": "string"},
            "document_type": {
                "type": "string",
                "enum": [*type_ids, ""],
            },
            "fields": {
                "type": "object",
                "properties": all_field_props,
                "required": [],
                "additionalProperties": False,
            },
            "is_complete": {"type": "boolean"},
        },
        "required": ["assistant_message", "document_type", "fields", "is_complete"],
        "additionalProperties": False,
    }
