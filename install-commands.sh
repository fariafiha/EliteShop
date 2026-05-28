# প্রথমে node_modules এবং package-lock.json ডিলিট করুন
rm -rf node_modules package-lock.json

# অথবা Windows এ:
# rmdir /s node_modules
# del package-lock.json

# এরপর clean install করুন
npm install --legacy-peer-deps

# অথবা force install করুন
npm install --force

# অথবা yarn ব্যবহার করুন (সবচেয়ে ভালো)
npm install -g yarn
yarn install

# অথবা pnpm ব্যবহার করুন
npm install -g pnpm
pnpm install
