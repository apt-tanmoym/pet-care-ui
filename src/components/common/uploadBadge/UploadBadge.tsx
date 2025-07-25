import React, { useRef, useState } from 'react';
import { Badge, Avatar, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

function UploadBadge() {
    const [image, setImage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
  
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
      }
    };
  
    const handleBadgeClick = () => {
      inputRef.current?.click();
    };
  
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageChange}
      />
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <IconButton
            size="small"
            onClick={handleBadgeClick}
            sx={{
              backgroundColor: 'white',
              boxShadow: 1,
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            <PhotoCamera fontSize="small" />
          </IconButton>
        }
      >
        <Avatar
          src={image || undefined}
          sx={{ width: 120, height: 120 }}
        />
      </Badge>
    </div>
  );
}

export default UploadBadge;