import { RegisterService } from "../services/userAction.service.js";

describe("RegisterService", () => {

    const name = "example";
    const email = "example@gmail.com";
    const pass = "123456"

    it("Deve criar a conta de usuário", async () => {


        const service = await RegisterService(name, email, pass);

        expect(service).toBeDefined();
    });

    it("deve lançar erro se o nome não for informado", async () => {
        await expect(
            RegisterService("", email, pass)
        ).rejects.toThrow();
    });

});

