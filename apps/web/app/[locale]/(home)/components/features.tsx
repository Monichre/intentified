import { User } from 'lucide-react';

export const Features = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
              Features built for modern businesses
            </h2>
            <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
              Our platform offers a comprehensive suite of tools designed to enhance your business operations
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2 lg:aspect-auto">
            <User className="h-8 w-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">
                Streamlined Workflows
              </h3>
              <p className="max-w-xs text-base text-muted-foreground">
                Automate repetitive tasks and optimize your team's productivity with intelligent workflow management
              </p>
            </div>
          </div>
          <div className="flex aspect-square flex-col justify-between rounded-md bg-muted p-6">
            <User className="h-8 w-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">
                Advanced Analytics
              </h3>
              <p className="max-w-xs text-base text-muted-foreground">
                Gain valuable insights from your data with our powerful analytics and reporting tools
              </p>
            </div>
          </div>

          <div className="flex aspect-square flex-col justify-between rounded-md bg-muted p-6">
            <User className="h-8 w-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">
                Secure Collaboration
              </h3>
              <p className="max-w-xs text-base text-muted-foreground">
                Work securely with team members and partners with our encrypted collaboration features
              </p>
            </div>
          </div>
          <div className="flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2 lg:aspect-auto">
            <User className="h-8 w-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">
                Customizable Integration
              </h3>
              <p className="max-w-xs text-base text-muted-foreground">
                Connect with your favorite tools and services using our flexible API and integration options
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
