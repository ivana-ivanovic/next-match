"use client";

import { registerUser } from "@/app/actions/authActions";
import { combinedRegisterSchema, profileSchema, registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { handleFormServerErrors } from "@/lib/util";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import ProfileForm from "./ProfileForm";
import UserDetailsForm from "./UserDetailsForm";
import z from "zod";

const stepSchemas = [registerSchema, profileSchema]


export default function RegisterForm() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = stepSchemas[activeStep];
  const [formData, setFormData] = useState<Partial<RegisterSchema>>({});


  //const {register, handleSubmit, setError, formState:{errors, isValid, isSubmitting}} = useForm<RegisterSchema>({
  // const methods = useForm<RegisterSchema>({
  //   resolver: zodResolver(currentValidationSchema),
  //   mode: "onTouched"
  // });
  type StepSchema = typeof stepSchemas[number];
  type StepFormValues = z.infer<StepSchema>;

  const methods = useForm<StepFormValues>({
    resolver: zodResolver(currentValidationSchema),
    mode: "onTouched"
  });

  

  const {setError, handleSubmit, getValues, formState:{errors, isValid, isSubmitting}} = methods

  const onSubmit = async () => {
    
    // const result = await registerUser(getValues());

    // if(result.status === "success") {
    //   router.push('/register/success');
    // } else {
    //   handleFormServerErrors(result, setError);
    // }

    const finalStepData = getValues();
    const rawData = { ...formData, ...finalStepData };

    const result = combinedRegisterSchema.safeParse(rawData);
    if (!result.success) {
      console.error(result.error.format());
    return;
    }

    const finalData: RegisterSchema = result.data;
    const user = await registerUser(finalData);
    if(user.status === "success") {
      router.push('/register/success');
    } else {
      handleFormServerErrors(user, setError);
    }

  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserDetailsForm />;
      case 1:
        return <ProfileForm />;
      default:
        return 'Unknown step';
    }
  }

  const onBack = () => {
    setActiveStep(prev => prev - 1);
  }

  const onNext = async () => {
    const stepData = getValues();
    setFormData(prev => ({ ...prev, ...stepData }));

    if (activeStep === stepSchemas.length - 1) {
      await onSubmit();
    } else {
      setActiveStep(prev => prev + 1)
    }
  }

  return (
    <Card className="w-2/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-secondary">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Register</h1>
          </div>
          <p className="text-neutral-500">Welcome to NextMatch</p>
        </div>
      </CardHeader>
      <CardBody>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onNext)}>
            <div className="space-y-4">
              {getStepContent(activeStep)}
              {errors.root?.serverError && (
                <p className="text-danger text-sm">{errors.root.serverError.message}</p>
              )}
              <div className="flex flex-row items-center gap-6">
                {activeStep !== 0 && (
                  <Button onPress={onBack} fullWidth>
                    Back
                  </Button>
                )}
                <Button 
                  isLoading={isSubmitting}
                  isDisabled={!isValid} fullWidth color="secondary" type="submit">
                  {activeStep === stepSchemas.length ? 'Submit' : 'Continue'}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
        
      </CardBody>
    </Card>
  )
}