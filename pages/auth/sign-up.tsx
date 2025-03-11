import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import useBotStore from "@/stores/bot";
import { SignUpRequest } from "@/interfaces/bot";

const SignUp: FC = () => {
  const { signUp } = useBotStore();
  const { push } = useRouter();

  const form = useForm<SignUpRequest>({
    initialValues: {
      email: "",
      password: "",
      name: "",
      token: "",
    },
    validate: {
      email: (value) =>
        /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : "Neplatný email",
      password: (value) =>
        value.length < 6 ? "Heslo musí mít alespoň 6 znaků" : null,
    },
  });

  const handleSignUp = async (values: SignUpRequest) => {
    try {
      await signUp(values);
      toast.success("Úspěšná registrace!"); // Replace this with your own success logic
    } catch (error) {
      toast.error(`Chyba při registraci: ${error}`);
    } finally {
      push("/auth/sign-in");
    }
  };

  return (
    <div className="h-screen flex items-center">
      <Container w="350px">
        <Title ta="center">Vítej!</Title>
        <Text c="dimmed" mt={5} size="sm" ta="center">
          Už máš Bota?{" "}
          <Anchor
            component="button"
            size="sm"
            onClick={() => push("/auth/sign-in")}
          >
            Přihlásit se
          </Anchor>
        </Text>

        <Paper withBorder mt={30} p={20} radius="md" shadow="md">
          <form onSubmit={form.onSubmit((values) => handleSignUp(values))}>
            <TextInput
              required
              label="Email"
              placeholder="tvuj@email.com"
              {...form.getInputProps("email")}
            />
            <TextInput
              required
              label="Jméno"
              mt="sm"
              placeholder="Tvoje jméno"
              {...form.getInputProps("name")}
            />
            <PasswordInput
              required
              label="Token"
              mt="sm"
              placeholder="Token tvého bota"
              {...form.getInputProps("token")}
            />
            <PasswordInput
              required
              label="Heslo"
              mt="sm"
              placeholder="Tvoje heslo"
              {...form.getInputProps("password")}
            />
            <Group justify="space-between" mt="10">
              <Anchor component="button" size="sm">
                Zapomněl si heslo?
              </Anchor>
            </Group>
            <Button fullWidth mt="10" type="submit">
              Registrovat se
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default SignUp;
