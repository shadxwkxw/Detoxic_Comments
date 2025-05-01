from pydantic import BaseModel, ConfigDict
from typing import Optional, Literal
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    
    model_config = ConfigDict(from_attributes=True) 

class UsernameRequest(BaseModel):
    username: str

class PostBase(BaseModel):
    title: str
    content: str
    category: Optional[int] = None

class PostCreate(BaseModel):
    title: str
    content: str
    category: Optional[int] = None
    username: str  
    
class NewsCreate(BaseModel):
    title: str
    content: str
    category: Optional[int] = None

class PostResponse(PostBase):
    id: int
    published_at: datetime
    type: str
    author_username: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class LoginResponse(BaseModel):
    success: bool
    user_id: int
    username: str
    
    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    username: str
    password: str

class UserLikeWithCategoryResponse(BaseModel):
    post_id: int
    category: Optional[int] = None
    title: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class TelegramLinkRequest(BaseModel):
    username: str
    telegram_id: str

class TelegramStatusResponse(BaseModel):
    is_linked: bool
    link: Optional[str] = None
    message: str

class TextClassificationRequest(BaseModel):
    text: str

class PendingPostCreate(BaseModel):
    title: str
    content: str
    username: str

class PendingPostResponse(BaseModel):
    id: int
    title: str
    content: str
    author_username: str
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ModeratePostRequest(BaseModel):
    admin_username: str
    approved: bool