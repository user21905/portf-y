import { projectRepository } from "../repositories/project.repository.js";
import { contactMessageRepository } from "../repositories/contact-message.repository.js";

export const dashboardService = {
  async getStats() {
    const [projectCount, messageCount, unreadCount] = await Promise.all([
      projectRepository.findAll().then((p) => p.length),
      contactMessageRepository.findAll().then((m) => m.length),
      contactMessageRepository.countUnread(),
    ]);
    const recentProjects = await projectRepository.findAll();
    const recentMessages = await contactMessageRepository.findAll();
    return {
      projectCount,
      messageCount,
      unreadCount,
      recentProjects: recentProjects.slice(0, 5),
      recentMessages: recentMessages.slice(0, 5),
    };
  },
};
