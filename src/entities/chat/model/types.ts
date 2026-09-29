export interface Chat {
  /** Внутренний идентификатор MAX, например "10000000". */
  chatId: string;
  /**
   * Номер в международном формате без «+».
   * Может быть пустым для чатов, созданных из входящих.
   */
  phone: string;
  title: string;
  createdAt: number;
}
