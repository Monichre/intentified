import { expect } from '@storybook/test';
import { userEvent, within } from '@storybook/testing-library';

/**
 * Testing utilities for component interactions in Storybook stories.
 * 
 * These functions provide common interaction patterns that can be used
 * in the `play` function of stories to create interactive tests.
 */

/**
 * Clicks on a button element based on its text content
 * 
 * @param canvasElement - The canvas element from the play function
 * @param buttonText - The text content of the button to click
 * @param options - Additional options for the click event
 */
export async function clickButton(
  canvasElement: HTMLElement, 
  buttonText: string,
  options?: Parameters<typeof userEvent.click>[1]
) {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button', { name: buttonText });
  await userEvent.click(button, options);
  return button;
}

/**
 * Clicks on a link element based on its text content
 * 
 * @param canvasElement - The canvas element from the play function
 * @param linkText - The text content of the link to click
 * @param options - Additional options for the click event
 */
export async function clickLink(
  canvasElement: HTMLElement, 
  linkText: string,
  options?: Parameters<typeof userEvent.click>[1]
) {
  const canvas = within(canvasElement);
  const link = canvas.getByRole('link', { name: linkText });
  await userEvent.click(link, options);
  return link;
}

/**
 * Types text into an input field based on its label
 * 
 * @param canvasElement - The canvas element from the play function
 * @param labelText - The text content of the input's label
 * @param inputText - The text to type into the input
 */
export async function typeIntoInput(
  canvasElement: HTMLElement, 
  labelText: string,
  inputText: string
) {
  const canvas = within(canvasElement);
  const input = canvas.getByLabelText(labelText);
  await userEvent.type(input, inputText);
  return input;
}

/**
 * Toggles a checkbox based on its label
 * 
 * @param canvasElement - The canvas element from the play function
 * @param labelText - The text content of the checkbox's label
 * @param checked - Whether to check or uncheck the checkbox
 */
export async function toggleCheckbox(
  canvasElement: HTMLElement, 
  labelText: string,
  checked: boolean
) {
  const canvas = within(canvasElement);
  const checkbox = canvas.getByLabelText(labelText);
  
  if ((checkbox as HTMLInputElement).checked !== checked) {
    await userEvent.click(checkbox);
  }
  
  return checkbox;
}

/**
 * Selects an option from a dropdown based on its label
 * 
 * @param canvasElement - The canvas element from the play function
 * @param labelText - The text content of the select's label
 * @param optionText - The text content of the option to select
 */
export async function selectOption(
  canvasElement: HTMLElement, 
  labelText: string,
  optionText: string
) {
  const canvas = within(canvasElement);
  const select = canvas.getByLabelText(labelText);
  await userEvent.selectOptions(select, optionText);
  return select;
}

/**
 * Hovers over an element based on its text content
 * 
 * @param canvasElement - The canvas element from the play function
 * @param text - The text content of the element to hover over
 */
export async function hoverElement(
  canvasElement: HTMLElement, 
  text: string
) {
  const canvas = within(canvasElement);
  const element = canvas.getByText(text);
  await userEvent.hover(element);
  return element;
}

/**
 * Asserts that text is visible in the component
 * 
 * @param canvasElement - The canvas element from the play function
 * @param text - The text to check for
 */
export function assertTextVisible(
  canvasElement: HTMLElement, 
  text: string
) {
  const canvas = within(canvasElement);
  const element = canvas.getByText(text);
  expect(element).toBeInTheDocument();
  return element;
}

/**
 * Asserts that an element has a specific attribute value
 * 
 * @param element - The element to check
 * @param attribute - The attribute name
 * @param value - The expected attribute value
 */
export function assertAttribute(
  element: HTMLElement,
  attribute: string,
  value: string
) {
  expect(element.getAttribute(attribute)).toBe(value);
}

/**
 * Asserts that an element has a specific class
 * 
 * @param element - The element to check
 * @param className - The class name to check for
 */
export function assertClass(
  element: HTMLElement,
  className: string
) {
  expect(element.classList.contains(className)).toBe(true);
}

/**
 * Waits for an element to appear in the document
 * 
 * @param canvasElement - The canvas element from the play function
 * @param selector - The CSS selector for the element to wait for
 * @param timeout - The maximum time to wait in milliseconds
 */
export async function waitForElement(
  canvasElement: HTMLElement,
  selector: string,
  timeout = 1000
) {
  return new Promise<HTMLElement>((resolve, reject) => {
    const startTime = Date.now();
    
    const checkForElement = () => {
      const element = canvasElement.querySelector(selector) as HTMLElement;
      
      if (element) {
        resolve(element);
        return;
      }
      
      if (Date.now() - startTime >= timeout) {
        reject(new Error(`Element not found: ${selector}`));
        return;
      }
      
      setTimeout(checkForElement, 100);
    };
    
    checkForElement();
  });
}