import React, { useState, useRef, useEffect } from 'react';

const GRID_SIZE = 100;
const MOBILE_GRID_SIZE = 100;

const DesktopIcon = ({ icon, label, position, onPositionChange, index, isPositionOccupied, isSelected, onContextMenu }) => {
  const [dragPosition, setDragPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [originalPosition, setOriginalPosition] = useState(position);
  const offsetRef = useRef({ x: 0, y: 0 });
  const iconRef = useRef(null);
  const [isTouching, setIsTouching] = useState(false);

  const snapToGrid = (x, y) => {
    const gridSize = window.innerWidth <= 768 ? MOBILE_GRID_SIZE : GRID_SIZE;
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  };

  useEffect(() => {
    const initialPosition = snapToGrid(position.x, position.y);
    setDragPosition(initialPosition);
    setOriginalPosition(initialPosition);
  }, [position]);

  // Mouse Events
  const handleDragStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setOriginalPosition(dragPosition);
    const rect = e.target.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleDrag = (e) => {
    if (!e.clientX || !e.clientY) return;
    
    const newPosition = {
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y
    };

    setDragPosition(newPosition);
  };

  // Touch Events
  const handleTouchStart = (e) => {
    e.stopPropagation();
    setIsTouching(true);
    setIsDragging(true);
    
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    offsetRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    setOriginalPosition(dragPosition);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const newX = touch.clientX - offsetRef.current.x;
    const newY = touch.clientY - offsetRef.current.y;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 50;
    const iconWidth = iconRef.current?.offsetWidth || 0;
    const iconHeight = iconRef.current?.offsetHeight || 0;

    const constrainedX = Math.max(0, Math.min(newX, viewportWidth - iconWidth));
    const constrainedY = Math.max(0, Math.min(newY, viewportHeight - iconHeight));

    setDragPosition({
      x: constrainedX,
      y: constrainedY
    });
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    setIsTouching(false);
    setIsDragging(false);
    
    const snappedPosition = snapToGrid(dragPosition.x, dragPosition.y);
    
    if (isPositionOccupied(snappedPosition, index)) {
      setDragPosition(originalPosition);
      return;
    }

    setDragPosition(snappedPosition);
    if (onPositionChange) {
      onPositionChange(index, snappedPosition);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const snappedPosition = snapToGrid(dragPosition.x, dragPosition.y);
    
    if (isPositionOccupied(snappedPosition, index)) {
      setDragPosition(originalPosition);
      return;
    }

    setDragPosition(snappedPosition);
    if (onPositionChange) {
      onPositionChange(index, snappedPosition);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu({
      x: e.clientX,
      y: e.clientY,
      isDesktop: false
    });
  };

  return (
    <div
      ref={iconRef}
      className={`absolute flex flex-col items-center justify-center p-2 rounded-lg 
        cursor-move hover:bg-gray-500/20 touch-none select-none
        ${isDragging ? 'opacity-50' : ''}
        ${isSelected ? 'bg-blue-500/30' : ''}
        ${isTouching ? 'scale-95' : ''}`}
      style={{
        left: `${dragPosition.x}px`,
        top: `${dragPosition.y}px`,
        width: window.innerWidth <= 768 ? `${MOBILE_GRID_SIZE}px` : `${GRID_SIZE}px`,
        height: window.innerWidth <= 768 ? `${MOBILE_GRID_SIZE}px` : `${GRID_SIZE}px`,
        transition: isDragging ? 'none' : 'all 0.2s ease-in-out'
      }}
      draggable={!isTouching}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
    >
      <img 
        src={icon} 
        alt={label} 
        className="w-9 h-9 md:w-11 md:h-11 mb-1" 
        draggable="false"
      />
      <span className="text-white text-xs md:text-sm text-center max-w-[96px] break-words">
        {label}
      </span>
    </div>
  );
};

export default DesktopIcon; 