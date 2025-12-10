import qrcode
import os

def generate_qr_code(url, filename="qr_code.png"):
    """
    Generate a QR code for a given URL
    
    Args:
        url (str): The URL to encode in the QR code
        filename (str): Output filename for the QR code image
    """
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,  # Controls the size of the QR code
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,  # Size of each box in pixels
        border=4,  # Border size in boxes
    )
    
    # Add data to QR code
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create an image from the QR code
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save the image
    img.save(filename)
    print(f"✅ QR Code generated successfully: {filename}")
    print(f"📍 Saved at: {os.path.abspath(filename)}")
    
    return filename

# Example usage
if __name__ == "__main__":
    # Your website URL (update this with your actual URL)
    website_url = ""  # Change this to your actual website URL
    
    print("🔗 QR Code Generator")
    print("=" * 50)
    
    # Option 1: Use default URL
    use_custom = input("Enter custom URL? (y/n): ").strip().lower()
    
    if use_custom == 'y':
        website_url = input("Enter the URL: ").strip()
    
    # Generate filename
    output_filename = input("Enter output filename (default: qr_code.png): ").strip()
    if not output_filename:
        output_filename = "qr_code.png"
    
    if not output_filename.endswith('.png'):
        output_filename += '.png'
    
    # Generate QR code
    try:
        generate_qr_code(website_url, output_filename)
        print("\n✨ QR code created successfully!")
        print(f"Scan this QR code to visit: {website_url}")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure you have installed the required package:")
        print("pip install qrcode[pil]")
