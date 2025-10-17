# Data Storage Guide - Ullavar Connect

This document explains where all form submission data is stored when users fill out forms on the Ullavar Connect platform.

## 📁 Storage Locations

### 1. **Primary Form Submissions Storage**
- **File**: `server/data/submissions.json`
- **Purpose**: Stores all form submissions from the email API
- **Forms Covered**:
  - ✅ Book My Team
  - ✅ Start Managing My Farm (AMC/Monthly Plans)
  - ✅ Upload Your Farm Details
  - ✅ Start AMC
  - ✅ Book Project
  - ✅ Schedule Soil Test
  - ✅ List Your Land for Buy/Sell
  - ✅ Request Quote in Construction

### 2. **User Registration Data**
- **File**: `server/data/user-data.json`
- **Purpose**: Stores user registration data
- **Forms Covered**:
  - ✅ Register as Farmer
  - ✅ Register as Worker/Contractor

### 3. **Email Logs**
- **File**: `server/data/email.log`
- **Purpose**: Logs all email sending attempts (successful or failed)
- **Contains**: Timestamps, email status, recipient, subject lines

## 📊 Data Structure

### submissions.json Format:
```json
[
  {
    "receivedAt": "2025-10-15T10:30:00.000Z",
    "toEmail": "uzhavarconnect2025@gmail.com",
    "subject": "Book My Team Submission from John Doe",
    "payload": {
      "name": "John Doe",
      "phone": "9876543210",
      "email": "john@example.com",
      "message": "Land booking details",
      "formType": "Book My Team",
      "extra": {
        "Contact Number": "9876543210",
        "Address": "123 Farm Road, Village",
        "Crop Planted": "Rice",
        "Land Image": "farm-image.jpg"
      }
    },
    "metadata": {
      "userAgent": "Mozilla/5.0...",
      "ip": "127.0.0.1",
      "referer": "http://localhost:3000/book-team",
      "contentLength": "234"
    }
  }
]
```

### user-data.json Format:
```json
[
  {
    "id": 1634567890123,
    "timestamp": "2025-10-15T10:30:00.000Z",
    "type": "farmer-registration",
    "data": {
      "userType": "farmer",
      "fullName": "John Farmer",
      "email": "john@farmer.com",
      "phone": "9876543210",
      "farmName": "Green Fields Farm",
      "farmSize": "10 acres",
      "cropTypes": "Rice, Wheat"
    },
    "userAgent": "Mozilla/5.0...",
    "ip": "127.0.0.1"
  }
]
```

## 🔐 Admin Access

### View All Form Submissions:
- **Endpoint**: `GET /api/submissions`
- **Authentication**: Requires admin key
- **Headers**: `x-admin-key: ullavar2025` or `?adminKey=ullavar2025`

### View User Registration Data:
- **Endpoint**: `GET /api/user-data`
- **Authentication**: Requires admin key
- **Headers**: `x-admin-key: ullavar2025` or `?adminKey=ullavar2025`

### Example Admin Request:
```bash
curl -H "x-admin-key: ullavar2025" http://localhost:4000/api/submissions
```

## 📧 Email Configuration

- **Recipient**: uzhavarconnect2025@gmail.com
- **Status**: Currently storing locally (SEND_EMAILS=false)
- **To Enable Real Emails**: 
  1. Set `SEND_EMAILS=true` in `.env`
  2. Configure Gmail App Password in `SMTP_PASS`

## 📝 Form Data Mapping

| Form Name | Data Storage | Email Sent | Form Type |
|-----------|--------------|------------|-----------|
| Book My Team | ✅ submissions.json | ✅ Local/Email | Book My Team |
| Start Managing My Farm | ✅ submissions.json | ✅ Local/Email | Start Managing My Farm |
| Upload Your Farm Details | ✅ submissions.json | ✅ Local/Email | Upload Your Farm Details |
| Start AMC | ✅ submissions.json | ✅ Local/Email | Start AMC |
| Book Project | ✅ submissions.json | ✅ Local/Email | Project Request |
| Schedule Soil Test | ✅ submissions.json | ✅ Local/Email | Soil Test Request |
| List Your Land (Main) | ✅ submissions.json | ✅ Local/Email | List Your Land for Buy/Sell (Main Page) |
| List Your Land (Page) | ✅ submissions.json | ✅ Local/Email | List Your Land for Buy/Sell |
| Request Quote | ✅ submissions.json | ✅ Local/Email | Request Quote in Construction |
| Register as Farmer | ✅ user-data.json + submissions.json | ✅ Local/Email | Register as Farmer |
| Register as Worker | ✅ user-data.json + submissions.json | ✅ Local/Email | Register as Worker/Contractor |

## 🛠️ Backup and Maintenance

### File Locations:
- `D:\Projects\ullavar-main\ullavar-main\server\data\submissions.json`
- `D:\Projects\ullavar-main\ullavar-main\server\data\user-data.json`
- `D:\Projects\ullavar-main\ullavar-main\server\data\email.log`

### Backup Recommendations:
1. Regular backup of the entire `data` folder
2. Monitor file sizes to prevent excessive growth
3. Archive old submissions periodically

## 🔍 Data Fields Captured

### Common Fields:
- Name
- Phone/Contact Number
- Email (when provided)
- Form Type
- Submission Timestamp
- User IP Address
- Browser Information

### Form-Specific Fields:
- **Book My Team**: Address, Crop Planted, Land Image
- **Farm Details**: Owner Name, Location Coordinates, Area, Irrigation Type
- **Land Listing**: Area, Price, Location, Documents
- **Construction Quote**: Project Type, Description, File Uploads
- **Registration**: Detailed profile information, experience, skills

## 📞 Support

All data is automatically sent to: **uzhavarconnect2025@gmail.com**

For technical support with data access or email configuration, check the server logs and ensure the backend is running on port 4000.