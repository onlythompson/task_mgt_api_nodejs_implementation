/**
 * 
 * This file defines the Category value object for the task management system.
 * Categories are used to classify and organize tasks based on their nature or purpose.
 * 
 * @module Category
 */

/**
 * Represents a category in the task management system as a value object.
 * 
 * Categories are immutable objects used to classify tasks. They are identified
 * by their name and description, not by a unique identifier. Two categories
 * with the same name and description are considered equal.
 * 
 * @class Category
 */
export class Category {
    /**
     * Creates a new Category instance.
     * 
     * @constructor
     * @param {string} name - Name of the category.
     * @param {string} [description] - Optional description of the category.
     */
    constructor(
      private readonly name: string,
      private readonly description?: string
    ) {}
  
    /**
     * Gets the name of the category.
     * 
     * @returns {string} The category's name.
     */
    getName(): string {
      return this.name;
    }
  
    /**
     * Gets the description of the category.
     * 
     * @returns {string | undefined} The category's description, if it exists.
     */
    getDescription(): string | undefined {
      return this.description;
    }
  
    /**
     * Checks if this category is equal to another category.
     * Two categories are considered equal if they have the same name and description.
     * 
     * @param {Category} other - The other category to compare with.
     * @returns {boolean} True if the categories are equal, false otherwise.
     */
    equals(other: Category): boolean {
      return this.name === other.name && this.description === other.description;
    }
  
    /**
     * Creates a new Category with an updated name.
     * 
     * @param {string} newName - The new name for the category.
     * @returns {Category} A new Category instance with the updated name.
     */
    withName(newName: string): Category {
      return new Category(newName, this.description);
    }
  
    /**
     * Creates a new Category with an updated description.
     * 
     * @param {string} newDescription - The new description for the category.
     * @returns {Category} A new Category instance with the updated description.
     */
    withDescription(newDescription: string): Category {
      return new Category(this.name, newDescription);
    }
  
    /**
     * Creates a string representation of the category.
     * 
     * @returns {string} A string describing the category.
     */
    toString(): string {
      return `Category: ${this.name}${this.description ? ` (${this.description})` : ''}`;
    }
  }