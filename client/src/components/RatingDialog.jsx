import React, { useState } from "react";
import { Star, X } from "lucide-react";

export const RatingDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialRating = 0,
  mediaTitle,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("RatingDialog - Submitting with notes:", notes);
    onSubmit(rating, notes);
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Rate {mediaTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-primary/60 hover:text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    value <= rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-primary/60 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-foreground"
              rows="4"
              placeholder="Write your thoughts about this title..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-primary/60 hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!rating}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
            >
              Save Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
