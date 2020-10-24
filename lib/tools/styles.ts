export class Styles {
    static setCursor(cursor: string) {
        document.body.style.cursor = cursor;
        // document.body.style.cursor = `url(img/cursors/${cursor}.png), ${cursor}`;
    }
}