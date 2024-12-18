import { useAnimation } from "framer-motion";
import { useState, useEffect, RefObject } from "react";

export const useCardAnimation = (cardRef: RefObject<HTMLDivElement>) => {
  const controls = useAnimation();
  const [dragStarted, setDragStarted] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, x: 0, scale: 1 });
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setInitialPosition({ x: rect.left, y: rect.top });
    }
  }, [controls, cardRef]);

  const checkCollision = (element: HTMLElement) => {
    const rect1 = element.getBoundingClientRect();
    const siblings = Array.from(element.parentElement?.children || [])
      .filter(child => child !== element && child instanceof HTMLElement) as HTMLElement[];
    
    return siblings.some(sibling => {
      const rect2 = sibling.getBoundingClientRect();
      const overlap = !(
        rect1.right < rect2.left || 
        rect1.left > rect2.right || 
        rect1.bottom < rect2.top || 
        rect1.top > rect2.bottom
      );
      
      // Add extra margin to prevent cards from getting too close
      const margin = 20;
      const tooClose = Math.abs(rect1.left - rect2.left) < margin;
      
      return overlap || tooClose;
    });
  };

  const resetPosition = () => {
    controls.start({ 
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1
      }
    });
  };

  const handleDragStart = () => {
    setDragStarted(true);
    controls.start({ scale: 0.95 });
  };

  const handleDrag = () => {
    if (cardRef.current && checkCollision(cardRef.current)) {
      resetPosition();
    }
  };

  const handleDragEnd = (e: HTMLElement | null, info: { offset: { x: number } }) => {
    setDragStarted(false);
    
    if (!e) return;
    
    if (cardRef.current && checkCollision(cardRef.current)) {
      resetPosition();
      return;
    }

    if (Math.abs(info.offset.x) > 50) {
      const carousel = e.closest('.embla');
      if (carousel) {
        controls.start({
          x: info.offset.x > 0 ? 200 : -200,
          opacity: 0.5,
          scale: 0.9,
          transition: { 
            duration: 0.3,
            ease: "easeOut"
          }
        }).then(() => {
          if (info.offset.x > 0) {
            carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
          } else {
            carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
          }
          resetPosition();
        });
      }
    } else {
      resetPosition();
    }
  };

  return {
    controls,
    dragStarted,
    handleDragStart,
    handleDrag,
    handleDragEnd
  };
};