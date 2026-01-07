# Mazad-on React Admin Panel

## UI Template

This project is built using **Elstar – React Tailwind Admin Template**, a modern and scalable admin dashboard solution.

- 📚 Documentation: https://elstar.themenate.net/docs/documentation/introduction
- 🔎 Live Demo: https://elstar.themenate.net

## 🚀 Run the App

1. **Run:** git clone <https://github.com/melkadylmc/admin.git>
2. **Run:** `npm install` - Install dependencies
3. **Run:** `npm start` - Run the application in <http://localhost:5173/>

- 📚 Api Documentation: https://doueh.com/api-docs

## 🚀 Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Redux Toolkit + redux-persist**
- **RTK Query / Axios**
- **React Router v6**
- **i18n (react-i18next)**
- **Hero Icons (react-icons/hi)**

---

## 📁 Project Structure

This project follows a **Hybrid Architecture**:

- **Layer-based** for shared/global concerns
- **Feature-based** for pages and domains

This approach provides:

- Scalability
- Clear separation of concerns
- Easy onboarding for new developers
- Enterprise-ready structure

---

Benefits of this Approach

- Modularity: By dividing components into page-specific and global ones, you achieve a high level of modularity, making it easier to manage and scale the application.
- Clarity: New developers can quickly understand which components belong to which part of the application.
- Maintenance: Isolated components reduce the risk of unintentional side effects when changes are made.

---

### Component Development

- **Keep Components Small:** Each component should do one thing well. Small components are easier to understand and reuse.

    _Example:_ Instead of a large form component, use smaller components like `TextInput`, `Checkbox`, and `SubmitButton`.

- **Component Styles:** Use Do not use inline styles and instead use Tailwind CSS utility classes to style components.

- **Reuse Components:** Check if an existing component can be reused before creating a new one.

## Contribution Rules

1. **Create a Branch:** Before starting any work, create a new branch from the main branch. Name your branch clearly to describe what you are working on (e.g., `feature-login-page` or `bugfix-header-issue`).

2. **Work on Your Branch:** Make all your changes on this new branch.

3. **Create a Pull Request (PR):** When you are done with your work, create a Pull Request (PR) to merge your branch into the main branch.

4. **Wait for Review:** Do not merge your own PR. Wait for [@Mohamed Hamdy]
(https://github.com/Mohamed22221) and the other team members to review your changes.

5. **Address Feedback:** If [@Mohamed Hamdy](https://github.com/Mohamed22221) or any of the other team members has any comments or requests for changes, make those changes on your branch and update the PR.
6. **Merge Gatekeeper:** No pull requests should be merged until they have been reviewed and approved by [@Mohamed Hamdy](https://github.com/Mohamed222215)

## VSCODE Extensions

### Required

- **ESLint:** For linting the code.
- **Prettier:** For formatting the code.
- **Tailwind CSS Intellisense:** For autocompletion of Tailwind CSS classes.
