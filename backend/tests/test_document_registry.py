from app.services import document_registry


def test_list_types_has_eleven_documents():
    assert len(document_registry.list_types()) == 11


def test_mutual_nda_fields_complete():
    fields = document_registry.empty_fields("mutual-nda")
    assert document_registry.is_complete(fields, "mutual-nda") is False
    for key in document_registry.DOCUMENT_TYPES["mutual-nda"].field_names:
        fields[key] = "value"
    assert document_registry.is_complete(fields, "mutual-nda") is True


def test_merge_fields_preserves_existing():
    current = document_registry.empty_fields("csa")
    current["providerCompany"] = "CloudCo"
    merged = document_registry.merge_fields(
        current, {"customerCompany": "Acme"}, "csa"
    )
    assert merged["providerCompany"] == "CloudCo"
    assert merged["customerCompany"] == "Acme"


def test_field_labels_for_each_type():
    for config in document_registry.list_types():
        labels = document_registry.field_labels(config.id)
        assert len(labels) == len(config.field_names)
