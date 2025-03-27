type Message = {
	action: Actions.PROVIDED_TOKEN;
	data: string;
} | {
	action: Actions;
	data: unknown;
}
