TINYMCE_DEFAULT_CONFIG = {
    "theme": "silver",
    "height": 600,
    "menubar": True,
    "browser_spellcheck": True,
    "contextmenu": False,
    "promotion": False,
    'branding': False,
    'skin': 'oxide',
    "plugins": (
        "accordion advlist anchor autolink autoresize autosave charmap code "
        "codesample directionality emoticons fullscreen help image importcss "
        "insertdatetime link lists media nonbreaking pagebreak preview quickbars "
        "searchreplace table visualblocks visualchars wordcount"
    ),
    "toolbar": (
        "undo redo | blocks fontfamily fontsize | "
        "bold italic underline strikethrough | forecolor backcolor | "
        "alignleft aligncenter alignright alignjustify | "
        "bullist numlist outdent indent | link image media table | "
        "blockquote codesample charmap emoticons | "
        "removeformat searchreplace visualblocks code fullscreen preview help"
    ),
    "toolbar_mode": "sliding",
    "quickbars_selection_toolbar": (
        "bold italic underline | quicklink blockquote"
    ),
    "style_formats_merge": True,
    "style_formats": [
        {
            "title": "Styled link",
            "selector": "a",
            "classes": "styled-link",
        },
    ],
    "link_class_list": [
        {"title": "Styled link", "value": "styled-link"},
        {"title": "Default link", "value": ""},
    ],
    "font_family_formats": (
        "Helvetica=helvetica,arial,sans-serif; "
        "Old London Alternate=OldLondonAlternate,serif; "
        "Arial=arial,helvetica,sans-serif; "
        "Arial Black=arial black,avant garde; "
        "Book Antiqua=book antiqua,palatino; "
        "Courier New=courier new,courier; "
        "Georgia=georgia,palatino; "
        "Impact=impact,chicago; "
        "Tahoma=tahoma,arial,helvetica,sans-serif; "
        "Times New Roman=times new roman,times; "
        "Trebuchet MS=trebuchet ms,geneva; "
        "Verdana=verdana,geneva"
    ),
    "font_css": (
        "https://db.onlinewebfonts.com/c/"
        "39fe060422750c672f65c87ea433856a?family=OldLondonAlternate"
    ),
    "content_css": (
        "https://db.onlinewebfonts.com/c/"
        "39fe060422750c672f65c87ea433856a?family=OldLondonAlternate"
    ),
    "content_style": (
        "body { font-family: Helvetica, Arial, sans-serif; } "
        ".styled-link { color: #ff6347; text-decoration: none; }"
    ),
}