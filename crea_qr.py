import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask

input_data = "https://person599.github.io/RegaloStefy/"

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=12,
    border=4,
)

qr.add_data(input_data)
qr.make(fit=True)

img = qr.make_image(
    image_factory=StyledPilImage,
    module_drawer=RoundedModuleDrawer(),
    color_mask=SolidFillColorMask(
        front_color=(196, 30, 58),   # rosso elegante
        back_color=(255, 255, 255)
    )
)

img.save("stefania_qr_elegante.png")
print("QR code generato e salvato come 'stefania_qr_elegante.png'")
