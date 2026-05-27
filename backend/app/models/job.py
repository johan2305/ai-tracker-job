from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.db import Base


class JobApplication(Base):

    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)

    company = Column(String, nullable=False)
    position = Column(String, nullable=False)

    status = Column(String, default="Applied", nullable=False)

    salary = Column(String, nullable=True)
    job_link = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    owner = relationship(
        "User",
        back_populates="jobs",
        lazy="joined"
    )

    def __repr__(self):
        return f"<JobApplication {self.company} - {self.position}>"