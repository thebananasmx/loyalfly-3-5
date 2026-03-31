import { createCanvas, loadImage } from 'canvas';
import admin from 'firebase-admin';

/**
 * Genera una imagen de sellos dinámica y la sube a Firebase Storage.
 * @param {string} bid Business ID
 * @param {string} cid Customer ID
 * @param {number} stampsCount Sellos actuales del cliente
 * @param {number} stampsGoal Meta de sellos del negocio
 * @param {string} cardColor Color de la tarjeta (hex o rgb)
 * @param {string} logoUrl URL del logo para usar como sello
 * @returns {Promise<string>} URL de la imagen generada
 */
export async function generateStampsImage(bid, cid, stampsCount, stampsGoal, cardColor, logoUrl) {
    const width = 1125;
    const height = 375; // Aspecto 3:1 ideal para Apple Strip y Google Hero
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 1. Fondo (Transparente o color sólido suave si se desea)
    ctx.clearRect(0, 0, width, height);

    // 2. Configuración de la cuadrícula
    const goal = stampsGoal || 10;
    const cols = goal > 10 ? Math.ceil(goal / 2) : 5;
    const rows = Math.ceil(goal / cols);
    
    const padding = 40;
    const availableWidth = width - (padding * 2);
    const availableHeight = height - (padding * 2);
    
    const cellWidth = availableWidth / cols;
    const cellHeight = availableHeight / rows;
    const radius = Math.min(cellWidth, cellHeight) * 0.35;

    // 3. Cargar el icono del sello (Logo del negocio)
    let stampIcon = null;
    if (logoUrl) {
        try {
            stampIcon = await loadImage(logoUrl);
        } catch (e) {
            console.warn("No se pudo cargar el logo para el sello, usando círculo sólido.");
        }
    }

    // 4. Dibujar los sellos
    for (let i = 0; i < goal; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        const x = padding + (col * cellWidth) + (cellWidth / 2);
        const y = padding + (row * cellHeight) + (cellHeight / 2);

        if (i < stampsCount) {
            // Sello Ganado
            if (stampIcon) {
                const iconSize = radius * 2;
                ctx.drawImage(stampIcon, x - radius, y - radius, iconSize, iconSize);
            } else {
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = cardColor || '#5134f9';
                ctx.fill();
            }
        } else {
            // Espacio Vacío (Círculo con opacidad)
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fill();
        }
    }

    // 5. Subir a Firebase Storage
    const buffer = canvas.toBuffer('image/png');
    const bucket = admin.storage().bucket();
    const filePath = `passes/${bid}/${cid}/stamps_v${Date.now()}.png`;
    const file = bucket.file(filePath);

    await file.save(buffer, {
        metadata: { contentType: 'image/png' },
        public: true
    });

    // Retornar la URL pública (o firmada si el bucket no es público)
    return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}
