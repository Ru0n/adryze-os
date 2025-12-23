# import xmlrpc.client

# # === FILL THESE VALUES ===
# url = 'https://erp.adryze.com'
# db = 'Panc_demo'          # From Odoo → Settings → Technical → Database
# api_user = 'api_integration@adryze.com'
# api_key = '5221ebd77eca8ff67287f4b730a29d3623747a4c'    # The key you just copied
# # ==========================

import xmlrpc.client
import base64
import requests

# ================= CONFIGURATION =================
url = "https://erp.adryze.com"  # Your Odoo URL
db = "Panc_live"                # Your Database Name
username = "aashish@adryze.com"              # Your Email/Login
password = "205fa378b9b3c6b422e6c15c6811752830e2ef33" # Your Password
# =================================================


# =============================================================================
# PRODUCT DATA - UPDATED FOR ODOO 19
# =============================================================================
products = [
    {
        "name": "Cigna Helmet",
        "list_price": 4000,
        "standard_price": 2800,
        "default_code": "CIGHEL",
        "type": "consu",
        "tags": [
            "Cigna",
            "Helmet",
            "Multi-colour"
        ],
        "image_url": "https://lh3.googleusercontent.com/pw/AP1GczPwEMNWgmlj-68LEdya8S0DgZJyLqrD7B6UYJq-9w4Cx5JpOb6Sz8iNDZv3PzeBuUf6oMVphr8ZWBKKdSAWQzhuUkAVbtylRyvlvJOfBDySqbtNLvbAEi4O0bSiN6h-cDbxf1J3lskVqNeds3yKRzXGEw=w1178-h1570-s-no-gm?authuser=0"
    },
    {
        "name": "Cairbull Bicycle Helmet CB-30",
        "list_price": 7500,
        "standard_price": 5250,
        "default_code": "CAIBICHEL",
        "type": "consu",
        "tags": [
            "Cairbull",
            "Helmet",
            "Magnetic Shield Visor"
        ],
        "image_url": "https://lh3.googleusercontent.com/pw/AP1GczPJkepz-wsP9A0A4ku9fjE5ZbwpeGZLNHT3cjSMBqQGhQWC7QFismTbw7pwGtI4zZZxUl7S8ur5srr1hwgUQOe5_9xB19d5JZ4-hOhPv5duTDwwpYNYPfbcnshhYwW8X6bBnObZfUFuujCJiwLGGv20Xg=w1200-h800-s-no-gm?authuser=0"
    },
    {
        "name": "West Biking 4-in-1 Bicycle Light/Horn/Phone Holder/Power Bank",
        "list_price": 3000,
        "standard_price": 2100,
        "default_code": "WESBIK4",
        "type": "consu",
        "tags": [
            "West Biking",
            "Light",
            "4-in-1 multifunction"
        ],
        "image_url": "https://lh3.googleusercontent.com/pw/AP1GczMIDRm-DC7FMORN-iktY-oWADCIdXXytlSEoRn5N8lvtUU8SVlpLUMXuTfb6caaC6E-KimKM9rGGBsTkv_YvJuS3FNkokiiBQ80eECbX_5MxYWJ2Y0iooI2Y9nrsarQtS68tjUKKGjOaAOZSLV53A8qRw=w560-h560-s-no-gm?authuser=0"
    },
    {
        "name": "Panccustom 3.C7M7 Mountain Bike",
        "list_price": 38000,
        "standard_price": 26600,
        "default_code": "PAN3C7M",
        "type": "consu",
        "tags": [
            "Panccustom",
            "Bike",
            "3x7 Microshift gear"
        ],
        "image_url": "https://lh3.googleusercontent.com/pw/AP1GczOSiYhdeNiZJT9hHjGVNEdz7qWW4SZn98_xCdhtclsi-EgGLLEDEYci76goRHCEQXM-3EpjnEe5syXtjwAZ61JyMwknzNjCjxZzIBwnDTAssKw6oM3NrNeP04epq60vmuPQB37u_SOsU3hmIakulamr4g=w2090-h1570-s-no-gm?authuser=0"
    },
    {
        "name": "GTA Marlin 2 MTB",
        "list_price": 24000,
        "standard_price": 16800,
        "default_code": "GTAMAR2",
        "type": "consu",
        "tags": [
            "GTA",
            "Bike",
            "27-speed mechanical disc"
        ],
        "image_url": "https://lh3.googleusercontent.com/pw/AP1GczPebxPl9SykvOCygv_qaJ-Y4KpbYm_iqT0qX6haMt9zBjmOIkR2UjPj7StvayvH3y-Q3pltiEKPYmnTCLcAnZYg79aPpZQ2KCwMvi0An1BuRu98IuIShjt_XeyD_2i3sNERztFbmb7EUaLKSuOjOvh1mA=w800-h581-s-no-gm?authuser=0"
    },
    {
        "name": "Polygon Razor BMX Bike",
        "list_price": 57000,
        "standard_price": 39900,
        "default_code": "POLRAZBMX",
        "type": "consu",
        "tags": [
            "Polygon",
            "Bike",
            "AL6 BMX Race frame"
        ],
        "image_url": "https://lh3.googleusercontent.com/pw/AP1GczNOvE1ZLqNyh0ptiukAu4iU4gqZmobpJG9hC4XwIEOp3EYsy5CubytTs7x_VvBio0yVHr_qztfboUiX0Ct_TBKITt-GClWyEm_0djkFEUYeQay7X58-RXC2VX78Woy4-B0n4pJFW7vIID1IWU8oXEyh8Q=w1000-h1000-s-no-gm?authuser=0"
    },
    {
        "name": "2021 Polygon Rogue BMX Bike",
        "list_price": 60000,
        "standard_price": 42000,
        "default_code": "202POLROG",
        "type": "consu",
        "tags": [
            "Polygon",
            "Bike",
            "Light alloy BMX frame"
        ],
        "image_url": "https://lh3.googleusercontent.com/pw/AP1GczPYVNVOUVI-Ei8keMcDeyuSZ5sDyqjp0gbDSnDKRV7mrI_oi6lXw3agRANiRifYeU0_7y5V_cmyEztyOgU4a09ClPDt7RKrbF6hpgngt5_hdtN7_NGpjfe1_oe1qy0KKnqjP4RlhNrkL4sDe_xhi-2ZSw=w1500-h924-s-no-gm?authuser=0"
    },
    {
        "name": "Panccustom Electric New Model",
        "list_price": 160000,
        "standard_price": 112000,
        "default_code": "PANELENEW",
        "type": "consu",
        "tags": [
            "Panccustom",
            "Ebike",
            "Hydraulic disc brakes"
        ],
        "image_url": "https://lh3.googleusercontent.com/pw/AP1GczNXOck_g3739e6j-qtn5Uo8fEsw-40JYYAqfUqolZ5z_kL0hU7xS51qefLeBF1SKv0QmpY8o6MyD5EJOKFKWW8IsRu3teXgMBEX-y2sShBVcLO9SQsawH9oJZFOzWZ2FenkQ-aZjbLsWc0pZ1ntQb2Vqg=w2094-h1570-s-no-gm?authuser=0"
    },
    {
        "name": "Trinx Numbering Password Lock",
        "list_price": 1350,
        "standard_price": 945,
        "default_code": "TRINUMPAS",
        "type": "consu",
        "tags": [
            "Trinx",
            "Lock",
            "Changeable password lock"
        ],
        "image_url": "https://lh3.googleusercontent.com/pw/AP1GczMBKl8rdQrBJaep_V9cpNoRpl23WmP2eAa7M3ELGURR7_CxUbwSz9L1cDj9lGXGV2BCB_z0gFuVO5CX88wQSsevztvSWQC-zHpYRVNu1pV11htE0qWR3Fj9fsEYIzj7lpYMvrCtEuqPvx2poExI4N0USA=w2880-h1364-s-no-gm?authuser=0"
    }
]


# =============================================================================
# CONNECT TO ODOO
# =============================================================================
print("🔌 Connecting to Odoo...")
try:
    common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
    
    # Test connection
    version = common.version()
    print(f"✅ Connected to Odoo {version.get('server_version', 'Unknown')}")
    
    # Authenticate
    uid = common.authenticate(db, username, password, {})
    
    if not uid:
        print("❌ Authentication Failed. Check credentials and API key.")
        exit(1)
        
    print(f"✅ Authenticated. User ID: {uid}")
    models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))
    
except Exception as e:
    print(f"❌ Connection Error: {e}")
    exit(1)

# =============================================================================
# CREATE PRODUCTS - FIXED FOR ODOO 19
# =============================================================================
print("\n🚀 Starting product creation WITH IMAGES...")
success_count = 0
error_count = 0

for p in products:
    try:
        print(f"\n📦 Processing: {p['name']}")
        
        # --- 1. HANDLE IMAGE (THE MISSING PART) ---
        image_base64 = False
        if p.get('image_url'):
            try:
                print(f"   ⬇️ Downloading Image...")
                response = requests.get(p['image_url'], timeout=10)
                if response.status_code == 200:
                    # Convert to Base64
                    image_base64 = base64.b64encode(response.content).decode('utf-8')
                    print("   ✅ Image encoded.")
                else:
                    print(f"   ⚠️ Image download failed: Status {response.status_code}")
            except Exception as img_err:
                print(f"   ⚠️ Image error: {img_err}")

        # --- 2. HANDLE TAGS ---
        tag_ids = []
        for tag_name in p['tags']:
            # ... (Your Tag Logic) ...
            # (Keep your existing tag logic here)
            existing_tag = models.execute_kw(db, uid, password, 'product.tag', 'search', [[['name', '=', tag_name]]])
            if existing_tag:
                tag_ids.append(existing_tag[0])
            else:
                new_tag_id = models.execute_kw(db, uid, password, 'product.tag', 'create', [{'name': tag_name}])
                tag_ids.append(new_tag_id)

        # --- 3. CREATE PRODUCT ---
        product_vals = {
            'name': p['name'],
            'list_price': p['list_price'],
            'standard_price': p['standard_price'],
            'default_code': p['default_code'],
            'type': 'consu', # Or 'product' if you fixed it
            'product_tag_ids': [(6, 0, tag_ids)],
            
            # THE MAGIC FIELD FOR IMAGE
            'image_1920': image_base64 # This sends the binary data to Odoo
        }
        
        product_id = models.execute_kw(db, uid, password, 'product.template', 'create', [product_vals])
        print(f"   ✅ Product created successfully (ID: {product_id})")
        success_count += 1
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        error_count += 1


# =============================================================================
# FINAL SUMMARY
# =============================================================================
print("\n" + "="*50)
print(f"📊 OPERATION COMPLETE")
print(f"✅ Successfully created: {success_count} products")
print(f"❌ Failed: {error_count} products")
print("="*50)