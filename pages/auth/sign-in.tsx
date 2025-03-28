import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import useBotStore from "@/stores/bot";
import { SignInRequest } from "@/interfaces/bot";

const SignIn: FC = () => {
  const { signIn } = useBotStore();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<SignInRequest>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : "Neplatný email",
      password: (value) =>
        value.length < 6 ? "Heslo musí mít alespoň 6 znaků" : null,
    },
  });

  const handleSignIn = async (values: SignInRequest) => {
    setIsLoading(true);

    try {
      await signIn(values);
      toast.success("Úspěšné přihlášení!");
    } catch (error) {
      toast.error(`Chyba při registraci: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-evenly flex-col">
      <Container w="350px">
        <Title ta="center">Vítej zpátky!</Title>
        <Text c="dimmed" mt={5} size="sm" ta="center">
          Ještě nemáš Bota?{" "}
          <Anchor
            component="button"
            size="sm"
            onClick={() => push("/auth/sign-up")}
          >
            Registrovat se
          </Anchor>
        </Text>

        <Paper withBorder mt={30} p={20} radius="md" shadow="md">
          <form onSubmit={form.onSubmit((values) => handleSignIn(values))}>
            <TextInput
              required
              label="Email"
              placeholder="tvuj@email.com"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              required
              label="Heslo"
              mt="sm"
              placeholder="Tvoje heslo"
              {...form.getInputProps("password")}
            />
            <Button fullWidth loading={isLoading} mt="10" type="submit">
              Přihlásit se
            </Button>
          </form>
        </Paper>
      </Container>
      <img alt="logo" className="w-[125px] ml-1" src="/logo.svg" />
    </div>
  );
};

export default SignIn;
