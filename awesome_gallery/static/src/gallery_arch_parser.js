/** @odoo-module **/
export class GalleryArchParser {
    parse(xmlDoc) {
        const imageField = xmlDoc.getAttribute("image_field");
        console.log("imageField", imageField);
        console.log("typeof imageField", typeof imageField);
        return {
            imageField,
        };
    }
}
