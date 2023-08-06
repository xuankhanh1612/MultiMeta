import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialExampleModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SplashComponent } from './pages/splash/splash.component';
import { LoginComponent } from './pages/login/login.component';
import { PlayMetaComponent } from './pages/play-meta-demo/play-meta.component';
import { AppRoutingModule } from './app-routing.module';
import { SessionService } from '../core-js/SessionService';
import { MetaService } from './api/fetch/api/meta.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChatComponent } from './pages/play-meta-demo/menus/chat/chat.component';
import { MultiplayerComponent } from './pages/play-meta-demo/menus/multiplayer/multiplayer.component';
import { AvatarComponent } from './pages/play-meta-demo/menus/avatar/avatar.component';
import { OptionsComponent } from './pages/play-meta-demo/menus/options/options.component';
import { PlaylistComponent } from './pages/play-meta-demo/menus/playlist/playlist.component';
import { HomeComponent } from './pages/home/home.component';
import { PlayGuestComponent } from './pages/play-guest/play-guest.component';
import { MediaComponent } from './pages/media/media.component';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { MediaItemsComponent } from './pages/media/media-items/media-items.component';
import { MediaVideosComponent } from './pages/media/media-videos/media-videos.component';
import { MediaPlayerComponent } from './pages/media/media-player/media-player.component';
import { EbookComponent } from './pages/ebook/ebook.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ConfirmComponent } from './pages/confirm/confirm.component';
import { LoadingComponent } from './pages/loading/loading.component';
import { MediaAudioDetailComponent } from './pages/media/media-audio-detail/media-audio-detail.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { VerifyUserComponent } from './pages/verify-user/verify-user.component';
import { ToastrModule } from 'ngx-toastr';
import { MediaService } from './api/fetch/api/media.service';
import { EbookViewerComponent } from './pages/ebook/ebook-viewer/ebook-viewer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AccountService } from './api/fetch/api/account.service';
import { ZoomService } from './api/fetch/api/zoom.service';

@NgModule({
    declarations: [AppComponent, LoginComponent, SplashComponent, PlayMetaComponent, ChatComponent, MultiplayerComponent, AvatarComponent, OptionsComponent, PlaylistComponent, HomeComponent, PlayGuestComponent, MediaComponent, MediaItemsComponent, MediaVideosComponent, MediaPlayerComponent, EbookComponent, ShopComponent, ConfirmComponent, LoadingComponent, MediaAudioDetailComponent, ProfileComponent, VerifyUserComponent, EbookViewerComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatNativeDateModule,
        MaterialExampleModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot(),
        PdfViewerModule
    ],
    providers: [SessionService, MetaService, BsModalRef, MediaService, AccountService, ZoomService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
