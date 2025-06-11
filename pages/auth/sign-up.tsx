import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Select,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import useBotStore from "@/stores/bot";
import { SignUpRequest } from "@/interfaces/bot";

const SignUp: FC = () => {
  const { signUp } = useBotStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    push,
    query: { isEvent },
    replace,
  } = useRouter();

  const form = useForm<SignUpRequest>({
    initialValues: {
      password: "",
      name: "",
      eventName: "",
      token: "",
      lang: "cs",
      isEvent: isEvent ? Boolean(isEvent) : false,
    },
    validate: {
      password: (value) =>
        value.length < 6 ? "Heslo musí mít alespoň 6 znaků" : null,
    },
  });

  const handleSignUp = async (values: SignUpRequest) => {
    setIsLoading(true);

    try {
      await signUp(values, Boolean(isEvent));
      toast.success("Úspěšná registrace!");
    } catch (error) {
      toast.error(`Chyba při registraci: ${error}`);
    } finally {
      setIsLoading(false);
      push("/auth/sign-in");
    }
  };

  return (
    <div className="h-screen flex items-center justify-evenly flex-col">
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
            {/* <Switch
              className="mt-5"
              defaultChecked={Boolean(isEvent)}
              label="Tento bot slouží pro Live Event"
              onChange={(event) => {
                form.setFieldValue("isEvent", event.currentTarget.checked);
                replace(`/auth/sign-up?isEvent=${event.currentTarget.checked}`);
              }}
            /> */}

            {form.getValues().isEvent ? (
              <TextInput
                required
                label="Jméno eventu"
                mt="sm"
                placeholder="DuckNationKickOff_bot"
                {...form.getInputProps("eventName")}
              />
            ) : (
              <TextInput
                required
                label="Jméno"
                mt="sm"
                placeholder="BabyDuck94_bot"
                {...form.getInputProps("name")}
              />
            )}
            <Select
              data={[
                { value: "cs", label: "Czech" },
                { value: "en", label: "English" },
                { value: "esp", label: "Spanish" },
                { value: "sk", label: "Slovak" },
              ]}
              label="Language"
              mt="sm"
              {...form.getInputProps("lang")}
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
            <Button fullWidth loading={isLoading} mt="10" type="submit">
              Registrovat se
            </Button>
          </form>
        </Paper>
      </Container>
      <img alt="logo" className="w-[125px] ml-1" src="/logo.svg" />
    </div>
  );
};

export default SignUp;
