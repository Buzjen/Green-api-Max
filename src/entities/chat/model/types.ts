export interface Chat {
  /** Внутренний идентификатор MAX, например "10000000". */
  chatId: string;
  /** Номер в международном формате без «+», может быть пустым для чатов из входящих. */
  phone: string;
  title: string;
  createdAt: number;
}
