export class Utils {
    static getResourceUrl(imagePath: string): string {
        if (!imagePath) return '/assets/placeholder.png';

        // Supporte les valeurs stockées comme "uploads/file.png" ou "file.png".
        const normalizedPath = imagePath.replace(/^uploads\//, '');
        return `${this.getUrl()}/uploads/${normalizedPath}`;
    }

    static getUrl(): string {
        return window.location.origin;
    }
}
