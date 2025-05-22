export interface IUseCases<InputDto, OutputDto> {
  execute(input: InputDto): Promise<OutputDto>;
}
