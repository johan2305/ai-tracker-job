@router.post("/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):

    try:
        existing = db.query(User).filter(User.email == user.email).first()

        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        new_user = User(
            name=user.name,
            email=user.email,
            hashed_password=hash_password(user.password)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    except Exception as e:
        db.rollback()
        print("🔥 REGISTER ERROR:", str(e))  # esto lo verás en Render logs

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )